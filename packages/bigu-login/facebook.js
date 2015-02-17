Meteor.startup(function() { // Because Cordova things must be ensured here

  if(Meteor.isClient) {

    Meteor.isLoggedOnFacebookThroughCordova = function() {

      if(Meteor.isCordova && typeof facebookConnectPlugin != "undefined") {      
        facebookConnectPlugin.getLoginStatus(function(response) {

          if(response.status === "connected") {
            return true;
          } else {
            return false;
          }
        });
      }

    }


    Meteor.loginWithFacebookAndCordova = function(options, callback) {

      var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);

      if(!options)
        var options = {};

      _.defaults(options, { permissions: ['public_profile', 'email', 'user_friends'] });

      var fbLoginSuccess = function(data) {
        data.cordova = true;

        Accounts.callLoginMethod({
          methodArguments: [data],
          userCallback: callback
        });
      };

      if(Meteor.isCordova) {      

          if(!Meteor.isLoggedOnFacebookThroughCordova) {

            facebookConnectPlugin.login(options.permissions, fbLoginSuccess, function(err) {
              console.log(err);
            });

          } else {
            Router.go('chat');
          }

      } else if(Accounts.loginServicesConfigured()) {

        Meteor.loginWithFacebook({
          requestPermissions: options.permissions
        }, function(err) {
          console.log(err);
        });

      }

    }

  }
  

});
