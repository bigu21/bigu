Messages = new Mongo.Collection('messages');

Messages.helpers({
  user: function() {
    return Users.findOne(this.userId);
  }
});
