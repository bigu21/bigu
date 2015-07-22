Package.describe({
  name: "bigu:keyboard",
  summary: "Bigu Keyboard Handler!",
  version: "0.0.1",
  git: "https://github.com/bigu21/meteor-keyboard.git"
});

Cordova.depends({
  'com.ionic.keyboard': 'https://github.com/bigu21/ionic-plugins-keyboard/tarball/56d0e45d87767ab7135f7e001575e238578f1e6e'
});

Package.onUse(function(api) {
  api.versionsFrom("1.0");
  api.use(["templating", "percolate:velocityjs", "underscore", "fastclick", "meteorhacks:flow-router", "tracker", "session"], "client");

  api.addFiles([
    "keyboard.js",
  ], "client");

  api.export("Keyboard");
});
