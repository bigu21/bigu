ApplicationController = RouteController.extend({
  layoutTemplate: 'appLayout',
  action: function() {
    this.render();
  },
  onBeforeAction: function () {
    // Segment.io setup
    analytics.page();

    this.next();
  }
});


