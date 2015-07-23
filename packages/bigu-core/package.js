Package.describe({
  name: 'bigu:core',
  summary: 'Bigu core.',
  version: '0.0.1',
  git: 'https://github.com/bigu21/bigu'
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.1.0.2']);

  // Core packages used by the app
  var packages = ['bigu:lib@0.0.1'];

  api.use(packages);
  api.imply(packages);

  api.addFiles([  ], [ 'client', 'server' ]);

});
