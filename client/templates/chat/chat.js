// Creating our chatRoomObject
var chatRoomObject =  function() {
};

chatRoomObject.prototype = {

   /*
    * We're going to hold everything here and load it asap(after render)
    */
  elements: {
    btnToggleChat: $('.toggleChat'),
    topBar: $('.topBar'),
    messageBar: $('.messageBar'),
    contentScrollable: $('.content-scrollable'),
    touchLayer: $('.touchLayer'),
    sendBtn: $('.sendBtn'),
    messageBox: $('.messageBox'),
    avatar: $('.avatar'),
  },

   /*
    * Loop trought above listed elements after they've got rendered
    * and reassign themselves the rendered object
    */
  getElementsOnRendered: function() {
    var self = this;
    Object.keys(self.elements).forEach(function(el) {
      self.elements[el] = $(self.elements[el].selector);
    });
  },

  /*
   * Check section status(maximized or minimized)
   */
  isChatMaximized: function() {
    if(!this.elements.btnToggleChat.hasClass('minimized'))
      return true;
    return false;
  },
  isChatMinimized: function() {
    return !this.isChatMaximized();
  },

  /*
   * Setups a toggle func to enable easy maximize/minimize of chat section
   */
  toggleChat: function() {
    if(this.isChatMaximized()) {
      this.minimizeChat();
    } else {
      this.maximizeChat();
    }
  },

  /*
   * Apply styles/transitions for minimizing chat section
   */
  minimizeChat: function() {
    var messageBarHeight = this.elements.messageBar.height();

    this.elements.topBar.velocity({ translateY: '0' }); 
    this.elements.contentScrollable.velocity({ translateY: '0', bottom: messageBarHeight }); 
    this.elements.btnToggleChat.removeClass('maximized').addClass('minimized');
  },

  /*
   * Apply styles/transitions for maximizing chat section
   */
  maximizeChat: function() {
    this.elements.topBar.velocity({ translateY: '50vh' }); 
    this.elements.contentScrollable.velocity({ translateY: '50vh', bottom: '-55%' }); 
    this.elements.btnToggleChat.removeClass('minimized').addClass('maximized');
  },

  /*
   * Setup touchLayer CSS 
   * TouchLayer is a helper layer living at DOM above messageBar input field,
   * it will override any direct interaction with input and by doing so will
   * provide better management on keyboard response, as it will not trigger
   * events that occur by default accordingly to a OS on input interaction.
   */
  __setupTouchLayer: function() {
    this.elements.touchLayer.css({
      position: 'absolute',
      height: this.elements.messageBar.css('height'),
      width: this.elements.messageBar.width()-this.elements.sendBtn.width() + 'px',
      bottom: 0,
      'z-index': 9999999999999
    });

  },
  /*
   * Setup the messageBar, it will also create a message object as a helper.
   */
  setupMessageBar: function() {
    this.__setupTouchLayer();

    // We already have this setup done, don't need to run again!
    //if(typeof this.message !== 'undefined')
      //return;

    this.message = {
      box: this.elements.messageBox,
      sendBtn: this.elements.sendBtn,
      getQuery: function() {
        return Messages.find({ chatId: FlowRouter.getParam('chatId') })
      }
    };

    _.extend(this.message, {
      enableBtn: function() {
        this.sendBtn.addClass('active');
      },
      disableBtn: function() {
        this.sendBtn.removeClass('active');
      },
      clear: function() {
        this.box.val('');
      },
      obj: function() {
        return {
          _id: Random.id(),
          chatId: FlowRouter.getParam('chatId'),
          userId: Meteor.userId(),
          message: this.box.val(),
          sentAt: new Date()
        }
      },
      isEmpty: function() {
        return this.box.val().trim() === '' ? true : false;
      }
    });

    _.extend(this.message, {
      // Update 'send' button on event occur, to active or not active state
      updateBtn: function() {
        if(this.isEmpty()) {
          this.disableBtn();
        } else {
          this.enableBtn();
        }
      },
      send: function() {
        Meteor.call('sendMessage', this.obj());
      }
    });

  },
  keyboard: {
  }
}

// Instantiating locally a chatRoomObject
var chatRoom = new chatRoomObject();


Template.chatRoom.onRendered(function() {
  chatRoom.getElementsOnRendered();
  chatRoom.setupMessageBar();
});

Template.messageBar.events({
  'click .touchLayer': function(e, t) {
    e.preventDefault();

    if(chatRoom.isChatMinimized())
      chatRoom.maximizeChat();

    chatRoom.elements.messageBox.focus();
  },
  'click .sendBtn, keyup .messageBox': function(e, t) {
    chatRoom.message.updateBtn(); 

    // Message will be sended only when sendBtn clicked or
    // return/enter key pressed on Desktops
    if(e.type === 'click' || 
       (e.type === 'keyup' && e.which === 13 && Device.desktop())) {
      e.preventDefault();

      if(!chatRoom.message.isEmpty()) {
        if(Keyboard.isOpen())
          Keyboard.reFocusOn(chatRoom.elements.messageBox);

        chatRoom.message.disableBtn();
        chatRoom.message.send();
        chatRoom.message.clear();
      }

    }
  }
});


Template.topBar.events({
  'click .toggleChat': function(e, t) {
    chatRoom.toggleChat();
   }
});


Template.chatList.helpers({
  'chatList': function() {
    return Chats.find();
  }
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

  var $avatar = template.$(chatRoom.elements.avatar.selector);
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

    $lastMsg.velocity('scroll', {
      axis: 'y',
      container: chatRoom.elements.contentScrollable,
      duration: Keyboard.transitionsDuration,
      easing: Keyboard.transitionsIn,
      queue: false
    });

    console.log($lastMsg);
    if($lastMsg.hasClass('received')) {
      Feedback.provide('messageReceived'); 
    } else {
      Feedback.provide('messageSent'); 
    }

  });
});


//Meteor.startup(function() {
  //var manager = $('body').data('hammer');
  //var quickSwipeDown = new Hammer.Swipe({
    //event: 'quickSwipeDown',
    //pointers: 1,
    //velocity: 0.1,
    //direction: Hammer.DIRECTION_DOWN,
    //threshold: 0.1,
  //});

  //manager.add(quickSwipeDown);
//});

//Template.topBar.gestures({
  //'quickSwipeDown .topBar': function() {
    //alert('pan');
  //}
//});

Template.messages.helpers({
  messages: function() {
    return Messages.find({ chatId: FlowRouter.getParam('chatId') });
  }
});

Template.messages.onCreated(function() {
  var template = this;
  this.autorun(function () {
    Session.set('Messages/beingSent', false);
    this.subscription = template.subscribe('Chats/messages', FlowRouter.getParam('chatId'));
  }.bind(this)); 
});

Template.messages.onRendered(function() {
  chatRoom.setupMessageBar();

  var messagesQuery = chatRoom.message.getQuery(); 
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
      Meteor.subscribe('Users/Basic', usersOnRoom);
    } else {
      //IonLoading.show();
    }

    if(!scrolled) {
      // Reset our scroll position
      //var routeName = 'hotfix-' + Router.current().route.getName();
      //if(IonScrollPositions[routeName]) {
        //$('.overflow-scroll').scrollTop(IonScrollPositions[routeName]);
      //}
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

    
    chatRoom.elements.messageBox.focus(); // ensure input is always focused

    // Stop scrolling on current scroll position
    var scrollPos = chatRoom.elements.contentScrollable.scrollTop();
    chatRoom.elements.contentScrollable.scrollTop(scrollPos)

    // if no big timeout + duration is set somewhat occurs and it won't 
    // scroll to last messages but two or three above
    Meteor.setTimeout(function() {
      // scroll to last message when keyboard opens
      $('.messages:last-child').velocity('scroll', {
        axis: 'y',
        container: chatRoom.elements.contentScrollable,
        duration: 100,
        offset: 9999999999999,
        easing: Keyboard.transitionsIn 
      });
    }, 300);

  });


});
