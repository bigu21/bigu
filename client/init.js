Meteor.startup(function() {

  // Segment.io
  analytics.load("OcmK1zzosm");
  // Production Hotjar TrackId: 18481 | Dev: 19690 
  hotjar.load("19690");

  Tracker.autorun(function(c) {
    // waiting for user subscription to load
    if (! Meteor.subscribe('user').ready() || (! Router.current() || ! Router.current().ready()))
      return;

    var user = Meteor.user();
    if (! user)
      return;

    c.stop();

    analytics.identify(user._id, {
      name: user.profile.name,
      email: user.services.facebook.email && user.services.facebook.email
    });

  });

  Meteor.users.after.insert(function(userId, doc) {
    analytics.alias(this._id);
  });

  if(Meteor.isCordova) {
    // Set status bar style to default
    StatusBar.styleDefault();

    // Potentially prompts the user to enable location services. We do this early
    // on in order to have the most accurate location by the time the user shares
    //Geolocation.currentLocation();
  }

  Feedback.profiles = {
    "messageSent": {
      sound: "/sounds/message_sent.mp3",
    },
    "messageReceived": {
      sound: "/sounds/message_received.mp3",
      vibrate: [500]
    }
  }

});

//Push.addListener('token', function(token) {
    //console.log("TOKEN");
    //alert(JSON.stringify(token));
//});

Push.debug = true;
