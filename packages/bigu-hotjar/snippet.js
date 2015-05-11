// Create a queue, but don't obliterate an existing one!
hotjar = hotjar || [];

// If the real hotjar.js is already on the page return.
if (hotjar.initialize) return;

// If the snippet was invoked already show an error.
if (hotjar.invoked) {
  if (window.console && console.error) {
    console.error('Hotjar snippet included twice.');
  }
  return;
}

// Invoked flag, to make sure the snippet
// is never invoked twice.
hotjar.invoked = true;

// Define a method to load hotjar.js from our CDN,
// and that will be sure to only ever load it once.
hotjar.load = function(key, sv){

  if (typeof sv === 'undefined') { sv = '3'; }
  // Create an async script element based on your key.
  window._hjSettings = { hjid: key, hjsv: sv };
  var script = document.createElement('script');
  script.async = true;
  script.src = '//static.hotjar.com/c/hotjar-' + key + '.js?sv=' + sv; 

  // Insert our script next to the first script element.
  var first = document.getElementsByTagName('script')[0];
  first.parentNode.insertBefore(script, first);
};
