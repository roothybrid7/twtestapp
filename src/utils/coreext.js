/**
 * coreext.js - Implements undefined core feature.
 */

;(function(global, undefined) {
  'use strict';

  /**
   * Extend object.
   */
  if (typeof Object.create !== 'function') {
    Object.create = function(o) {
      var F = function() {};
      F.prototype = o;
      return new F();
    }
  }
}());
