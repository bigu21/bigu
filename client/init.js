Meteor.startup(function() {

  if(Meteor.isCordova) {
    // Set status bar style to default
    StatusBar.styleDefault();

    // Potentially prompts the user to enable location services. We do this early
    // on in order to have the most accurate location by the time the user shares
    //Geolocation.currentLocation();
  }

});
