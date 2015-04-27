Meteor.publish('Users/Basic', function(userId) {
  if(userId) {
    return Meteor.users.find({ _id: { $in: userId } }, { fields: { "services.facebook.accessToken": 0 } });
  } else if(this.userId) {
    return Meteor.users.find({ _id: this.userId });
  } else {
    this.ready();
  }
});

Meteor.publish('Chats/list', function() {
  return Chats.find();
});

Meteor.publish('Chats/messages', function(chatId) {
    var totalMessages = Messages.find({ chatId: chatId}).count();
    var messagesPerPage = 100;
    var messagesToSkip = 0;

    if(totalMessages >= messagesPerPage * 2)
      messagesToSkip = totalMessages - messagesPerPage;

  return Messages.find({ chatId: chatId }, { skip: messagesToSkip });
});
