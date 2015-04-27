Meteor.methods({
  createChat: function(options) {  
    // Chat type options: Local, Private, Ride(Group)
    // Chat type options: Fixed, Event, Private, Ride(Group – Temporary)

    _.defaults(options, {
      type: 'Local',
    });  

    return Chats.insert({
      type: options.type,
      name: options.name,
      loc: {
        type: options.loc.type,
        coordinates: options.loc.coordinates 
      }
    });
  },
  sendMessage: function(options) {
    this.unblock();

    var messageObj = {
      chatId: options.chatId,
      userId: options.userId,
      message: options.message,
      sentAt: options.sentAt
    };

    return Messages.insert(messageObj); 
  }
});
