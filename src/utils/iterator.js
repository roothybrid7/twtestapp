/**
 * iterator.js - Data iterator.
 */

;(function(global, $, undefined) {
  'use strict';

  global.App.Iterator = (function() {
    /**
     * Iterator.
     *
     * @constructor
     * @param {Array=} tokens Token data.
     */
    function Iterator(tokens) {
      this.tokens = tokens || [];
      this.length = this.tokens.length;
    }

    Iterator.prototype = {
      hasNext: function() {
        return this.length > 0 ? true : false;
      },
      next: function() {
        var item = this.tokens.shift();
        this.length = this.tokens.length;
        return item;
      }
    };

    return Iterator;
  }());
}(this, jQuery));
