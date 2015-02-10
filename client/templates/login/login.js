Template.login.events({
  'click .page.login .btn-facebook': function(e) {
    Meteor.loginWithFacebookAndCordova();
  }
});
