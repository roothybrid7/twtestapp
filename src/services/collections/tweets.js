/*!
 * tweets.js - Twitter data transfer/access model.
 */

;(function(global, $, undefined) {
  'use strict';

  global.App.Tweets = (function() {
    /**
     * Tweet Data collection.
     *
     * @constructor
     */
    function Tweets(attributes) {
      this.models = [];
      this._updateAttributes(attributes);
    }

    Tweets.prototype = {
      model: global.App.Tweet,  // set results data model.
      /**
       * Update and refresh tweet data from request.
       *
       * @private
       * @param {Object} attributes Tweet data.
       */
      _updateAttributes: function(attributes) {
        this._attributes = $.extend(
          {}, $.isPlainObject(attributes) ? attributes : {});
        return this;
      },
      count: function() {
        this.length = this._attributes.results.length;
        return this._attributes.results.length;
      },
      isEmpty: function() {
        return this.count() === 0 ? true : false;
      },
      // Get response all data.
      getResponse: function(key) {
        return this._attributes[key];
      },
      // Get result model.
      get: function(id) {
        return this._byId[id];
      },
      // Add result models.
      add: function(models) {
        var lastIdx = this.models.length;
        for (var i = 0, l = models.length; i < l; i++) {
          var model = this._prepareModel(models[i]);

          this.models[lastIdx] = this._prepareModel(models[i]);
          if (model.id) {
            this._byId[model.id] = model;
          }
          lastIdx += 1;
        }
        return this;
      },
      reset: function(data) {
        for (var i = 0, l = this.models.length; i < l; i++) {
          this._prepareModel(this.models[i]);
        }
        this._reset();
        this._updateAttributes(data);
        this.add(data.results);
        return this;
      },
      _reset: function() {
        this.length = 0;
        this.models = [];
        this._byId = {};
      },
      _prepareModel: function(model, options) {
        var opts = options || {};
        if ($.isPlainObject(model)) {
          var attrs = model;
          opts.collection = this;
          model = new this.model(attrs, opts);
        }
        return model;
      },
      _removeReference: function(model) {
        if (this === model.collection) {
          delete model.collection;
        }
      },
      /**
       * Twitter search from public timeline.
       *
       * @param {?string} keyword A search keyword.
       * @return {jQuery.Deferred} Deferred Object.
       */
      search: function(keyword) {
        var self = this,
            dfd = $.Deferred(),
            url = 'http://search.twitter.com/search.json';

        // http://search.twitter.com/search.json?q=KEYWORD&callback=?
        var request = $.ajax({
          type: 'GET',
          timeout: 10000,
          url: url,
          data: $.param({q: keyword}),
          dataType: 'jsonp'
        }).done(function(data, status, xhr) {
          dfd.resolve(self.reset(data), status, xhr);
        }).fail(function(xhr, status, httpStatus) {
          dfd.reject(self.reset(), status, xhr, httpStatus);
        });

        return dfd.promise();
      }
    };

    /**
     * Data model Factory method.
     *
     * @param {Object} attributes A response json.
     * @return {Tweets} The instantiate object.
     * @deprecated
     *    In order to change to data model like Backbone.Collection(backbone.js)
     *    from it like RoR ActiveRecord.
     */
    Tweets.create = function(attributes) {
      return new this(attributes);
    };

    return Tweets;
  }());
}(this, jQuery));
