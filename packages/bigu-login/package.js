Package.describe({
  summary: 'Provides Bigu login functionality',
  version: '0.0.1',
  name: 'bigu:login'
});

Cordova.depends({
 'com.phonegap.plugins.facebookconnect': 'https://github.com/Wizcorp/phonegap-facebook-plugin/tarball/5287cbf9a7a275dcb76477789c3b52b0a5ce0d42' 
});

Package.onUse(function(api) {

  api.use('accounts-base', ['client', 'server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);
  api.use('facebook', ['client', 'server']);
  api.use('service-configuration', ['client', 'server']);

  api.use('http', ['server']);
  api.use('underscore', ['client', 'server']);

  api.add_files('facebook_server.js', 'server');
  api.add_files("facebook.js");

  api.export('Facebook', 'server');
});
