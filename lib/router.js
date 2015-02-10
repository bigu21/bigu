Router.configure({
  layoutTemplate: 'appLayout'
});

Router.route('/', function () {
  if(Meteor.user())
    Router.go('carona');

  this.layout('loginLayout');
  this.render();
}, { name: 'login' });

Router.route('/recent', function () {
  Session.set('renderTabs', true);
  this.render();
}, { name: 'recent' });


Router.route('/carona', function () {
  Session.set('renderTabs', true);
  this.render();
}, { name: 'carona' });

Router.route('/settings', function () {
  Session.set('renderTabs', true);
  this.render();
}, { name: 'settings' });

Router.route('/settings/bug', function () {
  Session.set('renderTabs', false);
  this.render();
}, { name: 'report.bug' });
