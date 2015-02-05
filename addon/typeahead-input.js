import Ember from 'ember';
import Bloodhound from './bloodhound';

/** USAGES
 * suggestions from a list (local) or a url (remote query):
 *
 * ## local list
 * {{typeahead-input
 *       local=data
 *       displayKey="value"
 *       placeholder="search !"
 *       hint=true
 *       highlight=true
 *       minLength=1
 *       filterData="FunctionThatFilterTheData"
 *       emptyTemplate="<p>message when no results</p>"
 *       headerTemplate="<p>the header message</p>"
 *       footerTemplate="<p>the footer message</p>"
 *       suggestionTemplate="TheFunctionThatWillReturnTheSuggestionTemplate"}}
 *
 * ## remote
 * {{typeahead-input
 *      url="/path/to/data?search=%QUERY"
 *      displayValue="title"
 *      ... }}
 *
 */
export default Ember.TextField.extend({
    classNames: "typeahead",

    /** typeahead options **/
    hint: true,
    highlight: true,
    minLength: 1,

    options: function() {
        var hint = this.get('hint');
        var highlight = this.get('highlight');
        var minLength = this.get('minLength');
        return {
            hint: hint,
            highlight: highlight,
            minLength: minLength
        };
    }.property('hint', 'highlight', 'minLength'),

    /** dataset config **/
    displayKey: null,
    local: null,
    url: null,

    filterData: function(data) {
        return data;
    },

    source: function() {
        var url = this.get('url');
        var filterFn = this.get('filterData');
        var displayKey = this.get('displayKey');
        var local = this.get('local') || [];

        var bloodhoundConf = {
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace(displayKey),
            queryTokenizer: Bloodhound.tokenizers.whitespace
        };

        if (url) {
            bloodhoundConf.remote = {url: url, filter: filterFn};
        } else {
            bloodhoundConf.local = local;
        }

        var bloodhound = new Bloodhound(bloodhoundConf);
        bloodhound.initialize();
        return bloodhound.ttAdapter();
    }.property('url', 'displayKey', 'local.[]'),

    // template
    emptyTemplate: '<p>no results found</p>',
    headerTemplate: '',
    footerTemplate: '',

    /** computed property which returns a function that takes
     *  the suggestion data and returns the template
     */
    suggestionTemplate: function() {
        var displayKey = this.get('displayKey');
        return function(data) {
            return '<p class="tt-suggest-item">' + data[displayKey] + '</p>';
        };
    }.property('displayKey'),


    templates: function() {
        var empty = this.get('emptyTemplate');
        var header = this.get('headerTemplate');
        var footer = this.get('footerTemplate');
        var suggestion = this.get('suggestionTemplate');
        return {
            empty: empty,
            header: header,
            footer: footer,
            suggestion: suggestion
        };
    }.property('emptyTemplate', 'headerTemplate', 'footerTemplate', 'suggestionTemplate'),


    dataset: function() {
        var source = this.get('source');
        var displayKey = this.get('displayKey');
        var templates = this.get('templates');
        return {
            displayKey: displayKey,
            source: source,
            templates: templates
        };
    }.property('source', 'displayKey', 'templates'),


    _initializeTypeahead: function() {
        var options = this.get('options');
        var dataset = this.get('dataset');
        this.$().typeahead(options, dataset);
    }.on('didInsertElement'),


    _destroyTypeahead: function(){
        this.$().typeahead('destroy');
    }.on('willDestroyElement')
});
