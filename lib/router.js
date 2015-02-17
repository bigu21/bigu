Router.configure({
  layoutTemplate: 'appLayout'
});

Router.route('/', function () {
  if(Meteor.user()) {
    this.redirect('chat');
  } else {
    this.layout('loginLayout');
    this.render();
  }
}, { name: 'login' });

Router.route('/recent', function () {
  Session.set('renderTabs', true);
  this.render();
}, { name: 'recent' });


Router.route('/chat', function () {
  Session.set('renderTabs', true);
  this.render('chat', {
    data: function() {
      return {
        chats: Chat.find() 
      }
    }
  });
}, { name: 'chat' });

Router.route('/settings', function () {
  Session.set('renderTabs', true);
  this.render();
}, { name: 'settings' });

Router.route('/settings/bug', function () {
  Session.set('renderTabs', false);
  this.render();
}, { name: 'report.bug' });

Router.route('/chat/:_id', function () {
  Session.set('renderTabs', false);
  Session.set('chatId', this.params._id);
  this.render('chatShow', {
    data: function() {
      return {
        messages: Message.find({ 
          chatId: this.params._id
        }),
      };
    } 
  });
}, { name: 'chat.show' });
