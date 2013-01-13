/*!
 * view.js - Render tweets view.
 */

;(function(global, $, undefined) {
  'use strict';

  var App = global.App,
      functions = App.functions;

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
        if (functions.isDefinedOrNotNull(keyword)) {
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

        return this.tweetView(item.get('profile_image_url'), userLink, text);
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
