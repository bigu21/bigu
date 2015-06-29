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
    this.unblock();

    var totalMessages = Messages.find({ chatId: chatId}).count();
    var messagesPerPage = 25;
    var messagesToSkip = 0;

    // If totalMessages is gte double of messagesPerPage then we should already
    // start to skip the first messages and load only the slice we want
    if(totalMessages >= messagesPerPage * 2)
      messagesToSkip = totalMessages - messagesPerPage;

  return Messages.find({ chatId: chatId }, { 
    skip: messagesToSkip, 
    sort: { sentAt: 1 }
  });
});

Meteor.startup(function () {  
    Messages._ensureIndex({ chatId: 1, sentAt: 1 });
});
