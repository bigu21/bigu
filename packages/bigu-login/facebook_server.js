Accounts.registerLoginHandler(function(loginRequest) {
  if(!loginRequest.cordova) {
    return undefined;
  }

  loginRequest = loginRequest.authResponse;
  var identity = getIdentity(loginRequest.accessToken);

  var serviceData = {
    accessToken: loginRequest.accessToken,
    expiresAt: (+new Date) + (1000 * loginRequest.expiresIn)
  };

  var whitelisted = ['id', 'email', 'name', 'first_name',
      'last_name', 'link', 'username', 'gender', 'locale', 'age_range'];

  var fields = _.pick(identity, whitelisted);
  _.extend(serviceData, fields);

  var options = {profile: {}};

  //var profileFields = [
    //"name", "first_name", "last_name", "link", "gender", "locale", "timezone", "updated_time", "verified"
  //];

  //profileFields = _.pick(identity, profileFields);
  //_.extend(options.profile, profileFields);

  // GET AND SAVE PROFILE URL
  //var profilePicture = getProfilePicture(loginRequest.accessToken);
  //serviceData.avatar = profilePicture;

  return Accounts.updateOrCreateUserFromExternalService("facebook", serviceData, options);

});

var getIdentity = function (accessToken) {
  try {
    return HTTP.get("https://graph.facebook.com/me", {
      params: {access_token: accessToken}}).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Facebook. " + err.message),
                   {response: err.response});
  }
};

var getProfilePicture = function (accessToken) {
  try {
    return HTTP.get("https://graph.facebook.com/v2.0/me/picture/?redirect=false", {
      params: {access_token: accessToken}}).data.data.url;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Facebook. " + err.message),
                   {response: err.response});
  }
};
