Router.configure({
  layoutTemplate: 'appLayout',
  controller: 'ApplicationController'
});

Router.route('/', function () {
  if(Meteor.user()) {
    this.redirect('chat');
  } else {
    this.layout('');
    this.render();
  }
}, { name: 'login' });

Router.route('/recent', function () {
  Session.set('renderTabs', true);
  this.render();
}, { name: 'recent' });

Router.route('/settings', function () {
  Session.set('renderTabs', true);
  this.render();
}, { name: 'settings' });

Router.route('/settings/bug', function () {
  Session.set('renderTabs', false);
  this.render();
}, { name: 'report.bug' });


