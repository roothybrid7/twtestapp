/**
 * viewhelpers.js - View helpers functions.
 */

;(function(global, $, undefined) {
  'use strict';

  global.App.viewHelpers = (function() {
    var module = {
      loadingView: [
        '<div class="loading bar">',
        '<div></div>',
        '<div></div>',
        '<div></div>',
        '<div></div>',
        '<div></div>',
        '<div></div>',
        '<div></div>',
        '<div></div>',
        '<div></div>',
        '<div></div>',
        '<div></div>',
        '<div></div>',
        '</div>'
      ].join(''),
      isDefinedOrNotNull: function(object) {
        return (typeof object !== 'undefined' || object !== null);
      },
      compact: function(array) {
        var arr = $.isArray(array) ? array : [array];
        return $.grep(arr, function(val, i) {
          return !!val;
        });
      },
      createAnchor: function(url, text) {
        return [
          '<a href="',
          encodeURI(url),
          '" target="_blank">',
          text ? text : url,
          '</a>'
        ].join('');
      }
    };

    return module;
  }());
}(this, jQuery));
