Template.messageBar.events({  
  'click .touchLayer': function(e, t) {
    e.preventDefault();

    var $msg = t.find('#msg');
      $msg.focus();
  },
  'click button, keypress #msg': function(e, t) {
    var controller = Iron.controller();
    var $msg = t.find('#msg');
    var isKeyboardOpen = $('body').hasClass('keyboard-open');

    var messageObj = {
      _id: Random.id(),
      chatId: controller.state.get('chatId'),
      userId: Meteor.userId(),
      message: $msg.value,
      sentAt: new Date()
    };


    if(e.type === 'click' || (e.type === 'keypress' && e.which === 13)) {
      e.preventDefault();

      if($msg.value.trim() === '') { // no message at all, re-focus
        //$msg.focus();
      } else if(isKeyboardOpen) {
        IonKeyboard.reFocusOn($msg);
        Meteor.call('sendMessage', messageObj);
        $msg.value = '';
      } else {
        Meteor.call('sendMessage', messageObj);
        $msg.value = '';
      }
    }
  },
});

Template.messageBar.onRendered(function() {
  $('.touchLayer').css({
    position: 'absolute',
    height: $('.bar-footer').css('height'),
    width: $('.bar-footer').width()-$('#btnEnviar').width() + 'px',
    bottom: 0,
    'z-index': 9999999999999,
    //border: '1px solid #000'
  });
});

Template.message.helpers({
  isReceived: function(userId) {
    if(Meteor.userId() === userId)
      return false;
    
    return true;
  }
});

Template.message.onRendered(function() {
  template = this;

  var $avatar = template.$('.avatar');
  var avatarSrc = $avatar.attr('src');
  $avatar.attr('src', avatarSrc).load(function() {
    $(this).addClass('loaded');
  });

  template.autorun(function(c) {
    if(Session.equals('Messages/beingSent', false))
      return false;
    c.stop();

    Session.set('Messages/beingSent', false);
    var $lastMsg = $('.messages:last-child');

    // XXX
    $lastMsg.find('.avatar').addClass('loaded');
    $lastMsg.find('.avatar, .bubble').addClass('animate');
    //$lastMsg.css('visibility', 'hidden').css('position', 'absolute');
    //IonKeyboard.transitionsDuration = IonKeyboard.transitionsDuration * 2;

    //$lastMsg.velocity('transition.bounceUpIn', {
    //duration: IonKeyboard.transitionsDuration * 2,
    //delay: IonKeyboard.transitionsDuration,
    //}).velocity('fadeIn', { 
    //delay: IonKeyboard.transitionsDuration,
    //duration: IonKeyboard.transitionsDuration * 2,
    //visibility: 'visible',
    //display: 'flex',
    //queue: false 
    //});

    $lastMsg.velocity('scroll', {
      axis: 'y',
      container: $('.content.overflow-scroll'),
      duration: IonKeyboard.transitionsDuration,
      easing: IonKeyboard.transitionsIn,
      queue: false
    });

    if($lastMsg.hasClass('received')) {
      Feedback.provide('messageReceived'); 
    } else {
      Feedback.provide('messageSent'); 
    }

  });
});

IonScrollPositions = {};

Router.onStop(function () {
  IonScrollPositions['hotfix-' + Router.current().route.getName()] = $('.overflow-scroll').scrollTop();
});

Template.chatShow.onCreated(function() {
  this.autorun(function () {
    var controller = Iron.controller();
    Session.set('Messages/beingSent', false);
    this.subscription = Meteor.subscribe('Chats/messages', Router.current().params._id);
  }.bind(this)); 
});

Template.chatShow.onRendered(function() {
  var messagesQuery = this.data.messages;
  var initialized = false;
  var scrolled = false;

  this.autorun(function() {
    if(this.subscription.ready()) {
      //IonLoading.hide();
      Meteor.setTimeout(function() {
        initialized = true;
      }, 10);

      var usersOnRoom = [];
      var msgs = messagesQuery.fetch();
      for (var index = 0; index < msgs.length; index++) {
        usersOnRoom[usersOnRoom.length] = msgs[index].userId;
      }
      usersOnRoom = _.uniq(usersOnRoom);
      console.log(usersOnRoom);
      Meteor.subscribe('Users/Basic', usersOnRoom);
    } else {
      //IonLoading.show();
    }

    if(!scrolled) {
      // Reset our scroll position
      var routeName = 'hotfix-' + Router.current().route.getName();
      if(IonScrollPositions[routeName]) {
        $('.overflow-scroll').scrollTop(IonScrollPositions[routeName]);
      }
    }

    // To skip initiallly added docs while observeChanges
    var handleNewMessages = messagesQuery.observeChanges({
      added: function(id, user) {
        if(initialized) {
          Session.set('Messages/beingSent', true);
          scrolled = true;
        }
      }
    });
  }.bind(this)); 

  window.addEventListener('native.keyboardshow', function (event) {

    $('input#msg').focus(); // ensure input is always focused

    // Stop scrolling on current scroll position
    var scrollPos = $('.content.overflow-scroll').scrollTop();
    $('.content.overflow-scroll').scrollTop(scrollPos)

    Meteor.setTimeout(function() {
      // scroll to last message when keyboard opens
      $('.messages:last-child').velocity('scroll', {
        axis: 'y',
        container: $('.content.overflow-scroll'),
        duration: 200,
        offset: 9999999999999,
        offset: 0,
        easing: IonKeyboard.transitionsIn 
      });
    }, 50);

  });

});
