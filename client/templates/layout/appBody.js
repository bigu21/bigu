var nextInitiator = null, initiator = null;
Tracker.autorun(function() {
  // add reactive dep
  FlowRouter.watchPathChange();

  initiator = nextInitiator;
  nextInitiator = null;
});


Template.appBody.rendered = function() {
  var template = this;

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

  //window.onpopstate = function(event) {
  //nextInitiator = 'back';
  //console.log(event);
  //}
}

Template.appBody.events({
  'click .js-back': function(event) {
    nextInitiator = 'back';

    history.back();
    event.stopImmediatePropagation();
    event.preventDefault();
  }
});
