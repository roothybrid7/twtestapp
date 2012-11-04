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
