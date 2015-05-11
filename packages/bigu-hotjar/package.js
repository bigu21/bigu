Package.describe({
  summary: "Hotjar integration for Meteor",
  version: "1.0.0_1",
  name: "bigu:hotjar",
  git: "https://github.com/bigu21/meteor-hotjar.git"
});

Package.on_use(function (api) {
  api.versionsFrom('METEOR@1.0.3.1');
  api.addFiles('snippet.js', 'client');
  api.export('hotjar');
});
