Package.describe({
  name: "bigu:device",
  summary: "Device.js wrapper",
  version: "0.0.1",
  git: "https://github.com/bigu21/meteor-device.git"
});

Package.onUse(function(api) {

  api.addFiles([
    "device.min.js"
  ], "client");

  api.export("Device");
});
