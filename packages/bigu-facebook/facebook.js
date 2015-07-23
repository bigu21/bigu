Accounts.oauth.registerService('facebook');

if (Meteor.isClient) {

  Meteor.loginWithFacebook = function (options, callback) {

    // support a callback without options
    if (! callback && typeof options === 'function') {
      callback = options;
      options = {};
    }

    _.defaults(options, {
      permissions: [ 'public_profile', 'email', 'user_friends' ]
    });

    var credentialRequestCompleteCallback =
      Accounts.oauth.credentialRequestCompleteHandler(callback);

    var fbLoginSuccess = function (data) {
      data.cordova = true;

      Accounts.callLoginMethod({
        methodArguments: [data],
        userCallback: callback
      });
    };

    var fbError = function (err) {
      if  (err === 'Permission denied.') {
        window.navigator.notification.alert(
          'Facebook obrigatório',
          'Desculpe mas você precisa logar no Facebook para prosseguir! Não \
          postaremos em seu nome e guardaremos muito bem das suas informações.',
          null,
          'Entendi :)'
        );
      } else {
        window.navigator.notification.alert(
          'Ops, erro!',
          'Parece que alguma coisa deu errado na nossa comunicação com \
          Facebook, entre em contato com a gente para resolvermos. Erro: ' + err
        );
      }
    };

    if (typeof facebookConnectPlugin !== 'undefined'
        && Meteor.settings.facebook) {
      facebookConnectPlugin.getLoginStatus(function (response) {

        if (response.status !== 'connected') {
          facebookConnectPlugin.login(
            options.permissions, fbLoginSuccess, fbError);
        } else {
          fbLoginSuccess(response);
        }
      }, fbError);

    } else if (Accounts.loginServicesConfigured()) {
      console.log(Facebook);
      Facebook.requestCredential(options, credentialRequestCompleteCallback);
    } else {
      console.log('Bigu-login: Something is wrong, \
        you dont have Cordova Facebook plugin(automatically installed \
        as dependency normally)  or Meteor.settings configured.');
    }
  };
} else {

  if (Meteor.settings &&
      Meteor.settings.facebook &&
      Meteor.settings.facebook.appId &&
      Meteor.settings.facebook.secret) {

    ServiceConfiguration.configurations.remove({
      service: 'facebook'
    });

    ServiceConfiguration.configurations.insert({
      service: 'facebook',
      appId: Meteor.settings.facebook.appId,
      secret: Meteor.settings.facebook.secret
    });

    Accounts.addAutopublishFields({
      // publish all fields including access token, which can legitimately
      // be used from the client
      // (if transmitted over ssl or on localhost).
      //
      // https://developers.facebook.com
      // /docs/concepts/login/access-tokens-and-types/,
      //
      // "Sharing of Access Tokens"
      forLoggedInUser: ['services.facebook'],
      forOtherUsers: [
        // https://www.facebook.com/help/167709519956542
        'services.facebook.id', 'services.facebook.username',
        'services.facebook.gender'
      ]
    });
  } else {
    console.log('Meteor settings for accounts-facebook-cordova\
                not configured correctly.');
  }
}
