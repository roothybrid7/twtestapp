/**
 * functions.js - Utility functions.
 */

;(function(global, $, undefined) {
  'use strict';

  global.App.functions = (function() {
    var module = {
      isDefinedOrNotNull: function(object) {
        return (typeof object !== 'undefined' || object !== null);
      },
      /**
       * compact array by removing 0, false, null, '' and undefined.
       *
       * @param {Array} array An source array.
       * @return {Array} The compacted array.
       */
      compact: function(array) {
        var arr = $.isArray(array) ? array : [array];
        return $.grep(arr, function(val, i) {
          return !!val;
        });
      }
    };

    return module;
  }());
}(this, jQuery));
