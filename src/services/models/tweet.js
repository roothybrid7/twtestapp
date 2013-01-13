/**
 * tweet.js - Tweet data model.
 */

;(function(global, $, undefined) {
  'use strict';

  var App = global.App,
      functions = App.functions;

  App.Tweet = (function() {
    /**
     * @type {Object} Parse link patterns in text.
     */
    var patterns = {
      user: /(^|\W)?(@\w+)(\W|$)?/g,
      hash: /(^|\W)?(#\w+)(\W|$)?/g,
      url: /((?:http|https):\/\/[\S]+)/g
    };

    /**
     * @type {Object} link text marker prefix.
     */
    var markers = {
      user: /^@/,
      hash: /^#/,
      url: /^(?:http|https):\/\//
    };

    /**
     * @type {Object} function mapping by key.
     */
    var mappers = {
      user: 'createUserUrl',
      hash: 'createHashUrl',
      url: 'createUrl',
    };

    /**
     * Tweet data model of result in response attributes.
     *
     * @constructor
     * @param {Object} attributes In results element.
     */
    function Tweet(attributes) {
      this._updateAttributes(attributes);
      this.idAttribute = 'from_user_id';
      this.set(this._attributes);
      this.tokenBuffer = [];
    }

    Tweet.prototype = {
      homepageUrl: 'https://twitter.com/',
      getPattern: function(key) {
        return key ? patterns[key] : patterns;
      },
      createUrl: function(url, key) {
        return url;
      },
      createUserUrl: function(user, key) {
        var marker = markers[key],
            suffix = user ? user : this.get('from_user');
        return this.homepageUrl + (marker ? suffix.replace(marker, '') : suffix);
      },
      createHashUrl: function(hash, key) {
        var marker = markers[key],
            format = 'https://twitter.com/search?q=%23%(text)s&src=hash';
        return format.replace('%(text)s', hash.replace(marker, ''));
      },
      parseLink: function(string, key, func) {
        var marker = markers[key];

        if (string.match(marker)) {
          var fnName = mappers[key],
              fn = fnName ? $.proxy(this[fnName], this) : null;
          if (typeof fn === 'function') {
            var url = fn(string, key);
            if (typeof func === 'function') {
              return func(url, string);
            }
          }
        }
        return string;
      },
      /**
       * Tokenize and parse link strings from text for each link type.
       *
       * @param {string} text
       *    A token source string(requires only on first call).
       * @param {string}
       *    key Parse link target type.
       *      Common link: url
       *      User: user
       *      Hash string: hash
       * @return {Array} split token string list.
       */
      parseText: function(text, key) {
        return functions.compact(text.split(patterns[key]));
      },
      _updateAttributes: function(attributes) {
        this._attributes = $.extend(
          {}, $.isPlainObject(attributes) ? attributes : {});
        return this;
      },
      // Get attribute.
      get: function(key) {
        return this._attributes[key];
      },
      set: function(key, value) {
        var attrs, val;

        if ((typeof key === 'object' && !$.isArray(key)) || !key) {
          attrs = key;
        } else {
          attrs = {};
          attrs[key] = value;
        }

        if (!attrs) {
          return this;
        }
        if (!$.isPlainObject(attrs)) {
          attrs = attrs._attributes;
        }

        if (this.idAttribute in attrs) {
          this.id = attrs[this.idAttribute];
        }

        var now = this._attributes;
        for (var attr in attrs) {
          val = attrs[attr];
          now[attr] = val;
        };
      },
      getAttributes: function() {
        return this._attributes;
      }
    };

    return Tweet;
  }());
}(this, jQuery));
