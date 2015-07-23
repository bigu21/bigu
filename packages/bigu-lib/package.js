Package.describe({
  name: 'bigu:lib',
  summary: 'Bigu libraries.',
  version: '0.0.1',
  git: "https://github.com/bigu21/bigu"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.1.0.2']);
  
  // Custom set of meteor core dependencies, took from meteor-platform
  var packages = [
    'meteor',
    'webapp',
    'logging',
    'tracker',
    'ddp',
    'mongo',
    'react',
    'underscore', // lodash is or choice, but underscore still required for meteor
    'check',
    'jquery',
    'random',
    'ejson'
  ];

  api.use(packages);
  api.imply(packages);

 api.use([
    // We can reload the client without messing up methods in flight.
    'reload',
    // And update automatically when new client code is available!
    'autoupdate'
  ], ['client', 'server']);

  // More mobile specific implies
  api.imply([
    // Remove the 300ms click delay on mobile
    'fastclick',
    // Good defaults for the mobile status bar
    'mobile-status-bar'
  ], 'web.cordova');

  api.imply([
    // Launch screen configuration. Currently only on mobile but we include the
    // no-op browser version anyway.
    'launch-screen'
  ], 'web');

  // Careful, things appended to Bigu namespace will be avaiable everywhere
  api.addFiles([
    'lib/core.js',
  ], ['client', 'server']);

  // Namespace it!
  api.export([
    'Bigu',
  ]);

});
