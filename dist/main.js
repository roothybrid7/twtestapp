/*! twtestapp - v0.0.0 - 2012-11-05
* Copyright (c) 2012 Satoshi Ohki; Licensed  */

/*!
 * app.js - Application root.
 */

;(function(global, undefined) {
 'use strict';

 global.App = {
  DEFAULT_KEYWORD: '@iphone_dev_jp'
 };

}(this));


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

/**
 * tweet.js - Tweet data model.
 */

;(function(global, $, undefined) {
  'use strict';

  global.App.Tweet = (function() {
    /**
     * compact array by removing 0, false, false, '' and undefined.
     *
     * @param {Array} array An source array.
     * @return {Array} The compacted array.
     */
    function compact(array) {
      var arr = $.isArray(array) ? array : [array];
      return $.grep(arr, function(val, i) {
        return !!val;
      });
    }

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
        return compact(text.split(patterns[key]));
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

/*!
 * view.js - Render tweets view.
 */

;(function(global, $, undefined) {
  'use strict';

  var App = global.App;

  App.View = (function() {
    // A signleton pointer.
    var instance = null;

    /**
     * Application view.
     * @constructor
     */
    function View() {
      if (instance) {
        return instance;
      }
      instance = this;
      return this;
    }

    View.prototype = {
      initialize: function(options) {
        var opts = options || {};
        this.collection = opts.collection;
      },
      registerEvents: function() {
        $(document).on('submit', 'form', $.proxy(this.onSubmit, this));
        return this;
      },
      onSubmit: function(ev) {
        var currentTarget = ev.currentTarget,
            $search = $('.tw-search'),
            keyword = $search.val();
        $search.blur();
        if (this.isDefinedOrNotNull(keyword)) {
          this.search(keyword);
        }
      },
      showLoading: function() {
        $('#tweets').html(this.loadingView);
      },
      hideLoading: function() {
        $('#tweets').empty();
      },
      search: function(keyword) {
        var self = this;
        this.showLoading();
        this.collection.search(keyword)
          .done($.proxy(this.onSuccessSearch, this))  // done(success)
          .fail($.proxy(this.onFailSearch, this));    // fail(error)
      },
      onSuccessSearch: function(data, status) {
        this.hideLoading();
        this.updateTweets(data);
      },
      onFailSearch: function(status) {
        console.error(status);
        this.hideLoading();
        $('#tweets').text('Error Loading Tweets');
      },
      updateTweets: function(tweets) {
        if (tweets.isEmpty()) {
          $('#tweets').text('Tweets are nothing');
        } else {
          this.updateList(tweets.models);
        }
      },
      updateList: function(data) {
        var self = this,
            $list = $('#tweets');
        $.each(data, function(i, item) {
          $list.append(self.createTweetList(item));
        });
      },
      createTweetList: function(item) {
        var userUrl = item.createUserUrl(),
            userLink = this.createAnchor(userUrl, item.get('from_user')),
            text = item.get('text') || '';

        /*
         * リンクを<a>タグに置き換える
         *
         * jQuery.Deferredのpipe()を使って
         * url -> twitter user -> hashの順番で処理する
         * MARK: 先にurlを処理しないと<a>タグ置き換え後のものを処理してしまう
         */
        var dfd = $.Deferred();
        dfd.pipe($.proxy(this.parseLinkInText, this))
          .pipe($.proxy(this.parseLinkInText, this))
          .pipe($.proxy(this.parseLinkInText, this))
          .pipe(function(model, t) {
            text = t;
          });
        dfd.resolve(item, text, ['url', 'user', 'hash']);

        return [
          '<div class="tw-content">',
          '<img class="avatar" src="' + item.get('profile_image_url') + '" />',
          '<p class="user">' + userLink + '</p>',
          '<p class="text">' + text + '</p>',
          '</div>'
        ].join('');
      },
      /**
       * テキスト中のリンク文字列を<a>タグに置き換え
       *
       * @param {Tweet} model Tweet data model.
       * @param {string} text The replace target tweet.
       * @param {Array.<string>} keys replace target mapping keys.
       * @return {jQuery.Deferred} jQuery deferred.
       */
      parseLinkInText: function(model, text, keys) {
        var dfd = $.Deferred(),
        key = keys.shift(),
        buffer = [],
        it = new App.Iterator(model.parseText(text, key));

        while (it.hasNext()) {
          var self = this,
              data = it.next();
          buffer.push(model.parseLink(data, key, function(url, data) {
            return self.createAnchor(url, data);
          }));
        }
        return dfd.resolve(model, buffer.join(''), keys);
      }
    };

    View.getInstance = function() {
      return instance || new View();
    };

    return View;
  }());
}(this, jQuery));

/*!
 * bootstrap.js - Setup scripts with Loading application.
 */

;(function(global, $, undefined) {
  'use strict';

  var App = global.App;

  // Mixins helpers to View.
  $.extend(App.View.prototype, App.viewHelpers);

  $(function() {
    var view = App.View.getInstance();
    view.initialize({collection: new App.Tweets()});
    view.registerEvents().search(App.DEFAULT_KEYWORD);
  });
}(this, jQuery));
