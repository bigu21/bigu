// Provide defaults for Meteor.settings

if (typeof Meteor.settings === 'undefined')
  Meteor.settings = {};

_.defaults(Meteor.settings, {
  facebook: {
    appId: "***REMOVED***", 
    secret: "***REMOVED***"
  }
});

ServiceConfiguration.configurations.remove({
  service: "facebook"
});

ServiceConfiguration.configurations.insert({
  service: "facebook",
  appId: Meteor.settings.facebook.appId,
  secret: Meteor.settings.facebook.secret
});

