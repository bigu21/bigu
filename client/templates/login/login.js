Template.login.events({
  'click .page.login .btn-facebook': function(e) {
    Meteor.loginWithFacebook(function() {
      FlowRouter.go('/chat');
    });
  }
});
