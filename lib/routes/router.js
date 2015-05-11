//Router.configure({
  //layoutTemplate: 'appLayout',
  //controller: 'ApplicationController'
//});

//Router.route('/', function () {
  //if(Meteor.user()) {
    //this.redirect('chat');
  //} else {
    //this.layout('');
    //this.render();
  //}
//}, { name: 'login' });

//Router.route('/recent', function () {
  //Session.set('renderTabs', true);
  //this.render();
//}, { name: 'recent' });

//Router.route('/settings', function () {
  //Session.set('renderTabs', true);
  //this.render();
//}, { name: 'settings' });

//Router.route('/settings/bug', function () {
  //Session.set('renderTabs', false);
  //this.render();
//}, { name: 'report.bug' });

FlowRouter.route('/', {
  action: function() {
    FlowLayout.render('appBody', { content: 'login' });
  }
});

var chatRoutes = FlowRouter.group({
  prefix: '/chat'
});

chatRoutes.route('/', {
  subscriptions: function() {
    this.register('chatList', Meteor.subscribe('Chats/list'));
  },
  action: function() {
    FlowLayout.render('appBody', { content: 'chatList' });
  }
});

chatRoutes.route('/:chatId', {
  middlewares: [scrollPosition],
  name: 'chatRoom',
  subscriptions: function(params) {
    this.register('chotRoom', Meteor.subscribe('Chats/messages', params.chatId));
  },
  action: function() {
    FlowLayout.render('appBody', { content: 'chatRoom' });
  }
});

scrollPositions = {};
var scrollPosition = function(path, next) {
  console.log(path);
  scrollPositions[path] = $('.overflow-scroll').scrollTop();
}
