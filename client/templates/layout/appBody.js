Template.appBody.rendered = function() {
  var template = this;

  nextInitiator = null;
  initiator = null;

  template.find('#content-container')._uihooks = {
    insertElement: function(node, next) {
      Session.set('isNavTransitionInProgress', true);
      var start = (initiator === 'back') ? '-100%' : '100%'; 

      $.Velocity.hook(node, 'translateX', start);

      $(node)
      .insertBefore(next)
      .velocity({translateX: [0, start]}, {
        duration: 300,
        easing: 'easing-in-out',
        queue: false,
        complete: function() {
          Session.set('isNavTransitionInProgress', false);
        }
      });
    },
    removeElement: function(node) {
      Session.set('isNavTransitionInProgress', true);
      var end = (initiator === 'back') ? '100%' : '-100%'; 

      $(node)
      .velocity({translateX: end}, {
        duration: 300,
        easing: 'easing-in-out',
        queue: false,
        complete: function() {
          Session.set('isNavTransitionInProgress', false);
          $(node).remove();
        }
      });
    }
  }
}
//Template.appLayout.rendered = function () {
  //var template = this;
  //template.autorun(function() {
    //if(Session.equals('renderTabs', true)) {

      //if(Session.equals('hasTabs', true)) {
        //template.$('.content').addClass('has-tabs');  
        //template.$('.tabs').removeClass('tabs-item-hide');  
      //}

      //if(Session.equals('hasTabsTop', true)) {
        //template.$('.content').addClass('has-tabs-top');  
        //template.$('.tabs').removeClass('tabs-item-hide');  
      //}

    //} else {
        //Meteor.setTimeout(function() {
          //template.$('.tabs').addClass('tabs-item-hide');  
          //template.$('.has-tabs').removeClass('has-tabs');  
          //template.$('.has-tabs-top').removeClass('has-tabs-top');  
        //}, 0);
    //}
  //});

//};

//// Render tabs por default
//Session.set('renderTabs', true);


//// Reload this shitty
//Template.chat.events({
  //'click .item-avatar img': function() {
    //window.location.reload();
  //}
//});


