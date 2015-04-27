// Provide defaults for Meteor.settings
if (typeof Meteor.settings === 'undefined')
  Meteor.settings = {};

_.defaults(Meteor.settings, {
  facebook: {
    appId: "***REMOVED***", 
    secret: "***REMOVED***"
  }
});

Push.allow({
  send: function(userId, notification) {
    // Allow all users to send to everybody - For test only!
    return true;
  }
});
