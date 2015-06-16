Messages = new Mongo.Collection('messages');
//Ground.Collection(Messages);

Messages.helpers({
  user: function() {
    return Users.findOne(this.userId);
  }
});
