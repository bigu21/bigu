Users = Meteor.users;

Users.allow({
 update: function(userId, doc, fields, modifier) {
   return doc._id === userId;
 } 
}, { fetch: '_id' });

Meteor.users._transform = function(doc) {
    return new UserModel(doc);
};

var UserModel = function User(doc) {
  _.extend(this, doc);
};

UserModel.prototype = {
  get name() {
    try {
      return this.services.facebook.name;
    } catch(e) {
      throw new Meteor.Error('name_must_exist_only_for_known_users_logged_through_facebook');
    }
  },
  set name(value) {
    Users.update({_id: this._id}, { $set: { "services.facebook.name": value } });
    return value;
  },
};

if(Meteor.isClient) {

  // Set currentUser to UserModel and exports User interface
  Tracker.autorun(function() {
    if(Meteor.subscribe('Users/Basic').ready()) {
      var currentUser = Meteor.user();
      User = new UserModel(currentUser);
    }
  });
}

if(Meteor.isServer) {
  Accounts.onLogin(function(attempt) {
    var currentUser = attempt.user;
    User = new UserModel(currentUser);
  });

  Accounts.onCreateUser(function(options, user) {

    // Save profile picture
    var profilePicture = 
      Facebook.getProfilePicture(user.services.facebook.accessToken);
    user.services.facebook.avatar = profilePicture;

    // We still want the default hook's 'profile' behavior.
    if (options.profile)
      user.profile = options.profile;
    return user;
  });
}
