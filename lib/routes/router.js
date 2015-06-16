FlowRouter.route('/', {
  action: function() {
    FlowLayout.render('appBody', { content: 'login' });
  }
});

var chatRoutes = FlowRouter.group({
  prefix: '/chat',
  //middlewares: [requiredLogin],
});

chatRoutes.route('/', {
  action: function() {
    FlowLayout.render('appBody', { content: 'chatList' });
  }
});

chatRoutes.route('/:chatId', {
  //middlewares: [scrollPosition],
  name: 'chatAndRide',
  action: function() {
    FlowLayout.render('appBody', { content: 'chatAndRide' });
  }
});

/*
 * Middlewares
 */

// Track scroll position when changing route
scrollPositions = {};
var scrollPosition = function(path, next) {
  scrollPositions[path] = $('.overflow-scroll').scrollTop();
}

// Redirect user to login if not logged-in
var requiredLogin = function(path, next) {
  var redirectPath = (! Meteor.userId()) ? "/" : null;
  next(redirectPath);
}
