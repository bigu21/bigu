Template.appLayout.rendered = function () {
  this.autorun(function() {
    if(Session.equals('renderTabs', true)) {
      Session.set('hasTabs', true);
      //$('.tabs').addClass('tabs-item-hide');  
      $('.tabs').css('visibility', 'visible');  
    } else {
      Session.set('hasTabs', false);
      $('.tabs').css('visibility', 'hidden');  
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
