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
      /**
       * Tweet view html string.
       *
       * @param {string} avatar An avatar image path.
       * @param {string} userLink User profile page url.
       * @param {string} text A Tweet string.
       * @return {string} Created Tweet HTML string.
       */
      tweetView: function(avatar, userLink, text) {
        return [
          '<div class="tw-content">',
          '<img class="avatar" src="' + avatar + '" />',
          '<p class="user">' + userLink + '</p>',
          '<p class="text">' + text + '</p>',
          '</div>'
        ].join('');
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
