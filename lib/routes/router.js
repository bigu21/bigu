FlowRouter.route('/', {
  name: 'login',
  triggersEnter: [alreadyLogged],
  action: function() {
    FlowLayout.render('appBody', { content: 'login' });
  }
});

//FlowRouter.triggers.enter([requiredLogin], {except: ["/"]});

var chatRoutes = FlowRouter.group({
  prefix: '/chat',
  //triggersEnter: [requiredLogin],
  triggersExit: [scrollPosition]
});

chatRoutes.route('/', {
  name: 'chatList',
  action: function() {
    FlowLayout.render('appBody', { content: 'chatList' });
  }
});

chatRoutes.route('/:chatId', {
  name: 'chatAndRide',
  action: function() {
    FlowLayout.render('appBody', { content: 'chatAndRide' });
  }
});

/*
 * Triggers 
 */

// Track scroll position when changing route
scrollPositions = {};
function scrollPosition(context) {
  scrollPositions[context.path] = $('.restoreScroll').scrollTop();
}

// Redirect user to login if not logged-in
function requiredLogin(context, redirect) {
  var redirectPath = (! Meteor.userId()) ? "/" : null;

  if(redirectPath)
    redirect(redirectPath);
}

// Redirect to chatList if logged 
function alreadyLogged(context, redirect) {

  if(Meteor.user())
    redirect('/chat');
}
