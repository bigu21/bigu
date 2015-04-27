Template.appLayout.rendered = function () {
  var template = this;
  template.autorun(function() {
    if(Session.equals('renderTabs', true)) {

      if(Session.equals('hasTabs', true)) {
        template.$('.content').addClass('has-tabs');  
        template.$('.tabs').removeClass('tabs-item-hide');  
      }

      if(Session.equals('hasTabsTop', true))
        template.$('.content').addClass('has-tabs-top');  

    } else {
        Meteor.setTimeout(function() {
          template.$('.tabs').addClass('tabs-item-hide');  
          template.$('.has-tabs').removeClass('has-tabs');  
          template.$('.has-tabs-top').removeClass('has-tabs-top');  
        }, 0);
    }
  });

};

// Render tabs por default
Session.set('renderTabs', true);


// Reload this shitty
Template.chat.events({
  'click .item-avatar img': function() {
    window.location.reload();
  }
});
