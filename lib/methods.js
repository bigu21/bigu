Meteor.methods({
  createChat: function(options) {  
    return createChat(options);
  },
  sendMessage: function(chatId, userId, message) {
    return sendMessage(chatId, userId, message);
  }
});

var sendMessage = function(chatId, userId, message) {
  return Message.insert({
    chatId: chatId,
    userId: userId,
    message: message
  }); 
}

var createChat = function(options) {
    // Chat type options: Local, Private, Ride(Group)

    _.defaults(options, {
      type: 'Local',
    });  

    return Chat.insert({
      type: options.type,
      name: options.name,
      loc: {
        type: options.loc.type,
        coordinates: options.loc.coordinates 
      }
    });
}
