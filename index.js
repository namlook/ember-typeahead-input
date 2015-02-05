/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-typeahead-input',

  included: function(app) {
    this._super.included(app);

    app.import(app.bowerDirectory + '/typeahead.js/dist/typeahead.bundle.js');
    app.import('vendor/typeahead-input.css');
  }
};
