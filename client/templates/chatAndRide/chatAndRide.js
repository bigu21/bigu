// Creating our chatAndRideObject
var chatAndRideObject =  function() {
};

chatAndRideObject.prototype = {
  messagesQuery: function() { 
    return Messages.find({ chatId: FlowRouter.getParam('chatId') });
  },
  /*
   * We're going to hold everything here and load it asap(after render)
   */
  elements: {
    topBar: $('.topBar'),
    chatArea: {
      btnToggleChat: $('.toggleChat'),
      messageBar: $('.messageBar'),
      contentScrollable: $('.content-scrollable'),
      touchLayer: $('.touchLayer'),
      sendBtn: $('.sendBtn'),
      messageBox: $('.messageBox'),
      getLastMsg: function(index) {
        if(! _.isUndefined(index))
          return $('.messages:nth-last-child(' + _.parseInt(index) + ')');

        return $('.messages:last-child');
      }
    }
  },

  /*
   * Loop trought above listed elements after they've got rendered
   * and reassign themselves the rendered jQuery with DOM object
   */
  getElementsOnRendered: function(template) {
    var self = this;

    // Copy me myself against me :)
    if(! self.__originalElements)
      self.__originalElements = self.elements;

    var transformElements = function(v) {
      if(_.isFunction(v))
        return v;

      if(_.has(v, 'selector'))
        return template.$(v.selector);

      if(_.isObject(v)) {
        return _.mapValues(v, function(childV) {
          return transformElements(childV);
        });
      }

      return v;
    }

    self.elements = _.mapValues(self.__originalElements, function(v) {
      return transformElements(v); 
    });

    //Object.keys(self.elements).forEach(function(el) {
    //_.attempt(function(selector) {
    //self.elements[el].selector;
    //});

    //if(! _.isFunction(self.elements[el]))
    //self.elements[el] = $(self.elements[el].selector);
    //});
  },

  /*
   * Check section status(maximized or minimized)
   */
  isChatMaximized: function() {
    if(!this.elements.chatArea.btnToggleChat.hasClass('minimized'))
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
  hideTopBar: function() {
    this.__hideTopBarAnimationRunning = true;

    // Ensure we will run it only if it's not playing already
    if(this.__hideTopBarAnimationRunning) {
      this.elements.topBar.velocity('slideUp', { 
        duration: 100,
        complete: function() {
          this.__hideTopBarAnimationRunning = false;
        }
      });
    }
  },
  showTopBar: function() {
    console.log('dads');
    // Ensure we will run it only if it's not playing already
    if(! this.__showTopBarAnimationRunning) {
      this.elements.topBar.velocity('slideDown', {
        delay: 300,
        duration: 800,
        easing: [500, 20],
        begin: function() {
          this.__showTopBarAnimationRunning = true;
        },
        complete: function() {
          this.__showTopBarAnimationRunning = false;
        }
      });
    }
  },
  __showTopBarAnimationRunning: false,
  __setupTopBarHammer: function() {
    var self = this;
    var toggleChatHammer = new Hammer.Manager(this.elements.topBar[0]);

    var smallSwipe = new Hammer.Swipe({
      event: 'smallSwipe',
      direction: Hammer.DIRECTION_VERTICAL, 
      threshold: 1,
      velocity: 1/100,
    });
    toggleChatHammer.add(smallSwipe);

    toggleChatHammer.on('smallSwipe', function(ev) {
      if(ev.direction === Hammer.DIRECTION_DOWN)
        self.minimizeChat();

      if(ev.direction === Hammer.DIRECTION_UP)
        self.maximizeChat();
    });
  },
  setupHammer: function() {
    this.__setupTopBarHammer();
  },
  /*
   * Apply styles/transitions for maximizing chat section
   */
  maximizeChat: function() {
    var messageBarHeight = this.elements.chatArea.messageBar.height();

    // Revert btnToggleChat to grid icon
    transformicons.revert(this.elements.chatArea.btnToggleChat[0]);

    this.elements.topBar.velocity(
      { translateY: '0' },
      { duration: 200 }
    ); 
    this.elements.chatArea.contentScrollable
    .velocity({ height: this.__maximizedChatHeight }, { duration: 0 })
    .velocity(
      { translateY: '0' },
      { 
        duration: 600,
        easing: [200, 25]
      }
    ); 
    this.elements.chatArea.btnToggleChat.removeClass('minimized').addClass('maximized');

    this.elements.chatArea.contentScrollable.find('.noMessages').removeClass('minimized')
  },
  /*
   * Apply styles/transitions for minimizing chat section
   */
  minimizeChat: function() {

    // Transform btnToggleChat to X icon
    transformicons.transform(this.elements.chatArea.btnToggleChat[0]);

    this.elements.topBar.velocity(
      { translateY: '50vh' },
      { duration: 200 }
    ); 

    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    var newHeight = (50*(h/100)) - chatAndRide.elements.topBar.innerHeight() 
    - chatAndRide.elements.chatArea.messageBar.innerHeight();

    this.elements.chatArea.contentScrollable
    .velocity(
      { translateY: '50vh' },
      { duration: 200 }
    )
    .velocity({ height: newHeight  }, { duration: 0 }); 
    this.elements.chatArea.btnToggleChat.removeClass('maximized').addClass('minimized');

    this.elements.chatArea.contentScrollable.find('.noMessages').addClass('minimized')
  },
  /*
   * Setup touchLayer CSS 
   * TouchLayer is a helper layer living at DOM above messageBar input field,
   * it will override any direct interaction with input and by doing so will
   * provide better management on keyboard response, as it will not trigger
   * events that occur by default accordingly to a OS on input interaction.
   */
  __setupTouchLayer: function() {
    this.elements.chatArea.touchLayer.css({
      position: 'absolute',
      height: this.elements.chatArea.messageBar.css('height'),
      width: this.elements.chatArea.messageBar.width()-this.elements.chatArea.sendBtn.width() + 'px',
      bottom: 0,
      'z-index': 9999999999999
    });
  },
  /*
   * Setup chat, it will also create a message object as a helper.
   */
  setupChat: function() {
    var self = this;
    this.__setupTouchLayer();

    var autosizeFirstTime = true;
    this.elements.chatArea.messageBox.focus(function() {
      if(autosizeFirstTime) {
        autosize($(this));
        autosizeFirstTime = false;
      }
    });

    this.elements.chatArea.messageBox.on('autosize:resized', function() {
      self.elements.chatArea.contentScrollable.css(
        'bottom', self.elements.chatArea.messageBar.innerHeight());
    });


    this.__maximizedChatHeight = this.elements.chatArea.contentScrollable.outerHeight();

    this.message = {
      box: this.elements.chatArea.messageBox,
      sendBtn: this.elements.chatArea.sendBtn,
      getQuery: function() {
        return self.messagesQuery();
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
        autosize.update(this.box);
      },
      obj: function() {
        return {
          _id: Random.id(),
          chatId: FlowRouter.getParam('chatId'),
          userId: Meteor.userId(),
          message: this.box.val().trim(),
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
  /*
   * Setup the waypoint for lastMessage to maximizeChat
   */
  setupLastMessageWaypoint: function(lastMsg) {
    var self = this;

    // If we already had a lastMessageWaypoint, destroy it!
    if(this.__lastMessageWaypoint)
      this.__lastMessageWaypoint.destroy();

    // No lastMsg param to reuse? Lets get again by ourselves
    if(_.isUndefined(lastMsg))
      lastMsg = this.elements.chatArea.getLastMsg(3);

    // Note that we are passing raw dom objects here instead of jQuery objects,
    // waypoint does require them to be raw!
    // If lastMsg still empty then we have no messages, so no waypoint!
    if(! _.isEmpty(lastMsg)) {
      this.__lastMessageWaypoint = new Waypoint({
        element: lastMsg[0],
        handler: function(direction) {
          //if(direction === 'down' && self.isChatMinimized())
          //self.maximizeChat();
        },
        offset: 'bottom-in-view',
        context: this.elements.chatArea.contentScrollable[0]
      });
    }
  },
  keyboard: {
  }
}

// Instantiating locally a chatAndRideObject
chatAndRide = new chatAndRideObject();

Template.chatAndRide.onRendered(function() {
  chatAndRide.getElementsOnRendered(this);
  chatAndRide.setupChat();
  chatAndRide.setupHammer();
});

Template.messageBar.events({
  'click .touchLayer': function(e, t) {
    e.preventDefault();

    if(chatAndRide.isChatMinimized()) {
      chatAndRide.maximizeChat();
      Keyboard.translateAttachBeforeEvent();

      Meteor.setTimeout(function() {
        chatAndRide.elements.chatArea.messageBox.focus();
      }, 380);
    } else {
      Keyboard.translateAttachBeforeEvent();
      chatAndRide.elements.chatArea.messageBox.focus();
    }
  },
  'keydown .messageBox': function(e, t) {
    // Disable new-line on Enter, still allow on Shift-enter
    if(Device.desktop() && e.which === 13 && !e.shiftKey) {
      e.preventDefault();
    }
  },
  'click .sendBtn, keyup .messageBox': function(e, t) {
    chatAndRide.message.updateBtn(); 
    chatAndRide.elements.chatArea.messageBox.trigger('autosize.resize');

    // Message will be sended only when sendBtn clicked or
    // return/enter(without shift) key pressed on Desktops
    if(e.type === 'click' || (Device.desktop() && e.which === 13 && !e.shiftKey)) {
      e.preventDefault();

      if(!chatAndRide.message.isEmpty()) {
        if(Keyboard.isOpen())
          Keyboard.reFocusOn(chatAndRide.elements.chatArea.messageBox);

        chatAndRide.message.disableBtn();
        chatAndRide.message.send();
        chatAndRide.message.clear();
      }

    }
  }
});

Template.topBar.events({
  'click .toggleChat': function(e, t) {
    chatAndRide.toggleChat();
  }
});


Template.message.helpers({
  time: function(sentAt) {
    return moment(sentAt).format('HH:mm');
  },
  isReceived: function(userId) {
    if(Meteor.userId() === userId)
      return false;

    return true;
  }
});

Template.message.onRendered(function() {
  template = this;

  // XXX – Implement avatar preloading
  var $avatar = template.$('.avatar');
  $avatar.addClass('loaded');

  //var avatarSrc = $avatar.attr('src');
  //$avatar.attr('src', avatarSrc).load(function() {
  //$(this).addClass('loaded');
  //});

  template.autorun(function(c) {
    if(Session.equals('Messages/beingSent', false))
      return false;
    c.stop();

    Session.set('Messages/beingSent', false);
    var $lastMsg = chatAndRide.elements.chatArea.getLastMsg();

    chatAndRide.setupLastMessageWaypoint();

    // XXX – Better animations to new messages
    $lastMsg.find('.avatar').addClass('loaded');
    $lastMsg.find('.avatar, .bubble').addClass('animate');

    $lastMsg.velocity('scroll', {
      axis: 'y',
      container: chatAndRide.elements.chatArea.contentScrollable,
      duration: Keyboard.transitionsDuration,
      easing: Keyboard.transitionsIn,
      queue: false
    });

    if($lastMsg.hasClass('received')) {
      Feedback.provide('messageReceived'); 
    } else {
      Feedback.provide('messageSent'); 
    }

  });
});


Template.messagesContainer.helpers({
  messages: function() {
    return chatAndRide.messagesQuery();
  },
  isReady: function() {
    if(Session.get('Messages/subscriptionReady') 
    && !Session.get('isNavTransitionInProgress')) {
        return true;
    }
    return false;
  },
  hasMessages: function() {
    return Session.get('totalMessages') !== 0;
  }
});

messagesSubs = new SubsManager();
Template.messagesContainer.onCreated(function() {
  var template = this;
  Session.set('Messages/beingSent', false);
});

var handleNewMessages;
Template.messagesContainer.onDestroyed(function() {
  handleNewMessages.stop();
});

Template.messagesContainer.onRendered(function() {
  var template = this;

  Meteor.call('totalMessages', FlowRouter.getParam('chatId'), function(err, res) {
    Session.set('totalMessages', res.count);
  });

  if(_.isUndefined(chatAndRide.message))
    chatAndRide.setupChat();

  template.messagesQuery = chatAndRide.message.getQuery(); 
  template.initialized = false;
  template.scrolled = false;

  Session.set('isLoadingMessagesAnimationInProgress', true);
  template.find('.content-scrollable')._uihooks = {
    removeElement: function(node) {
      if($(node).hasClass('loadingMessages')) {

        $(node).velocity({ translateY: '110vh' }, {
          duration: 500, 
          begin: function() {
          },
          complete: function() {
            Session.set('isLoadingMessagesAnimationInProgress', false);
          } 
        }).velocity('fadeOut', { queue: false });
      }
    }
  };


  this.autorun(function() {

    if(
      _.isUndefined(Session.get('isNavTransitionInProgress')) 
        || Session.equals('isNavTransitionInProgress', false)
    ) {
      template.subscription = template.subscribe('Chats/messages', FlowRouter.getParam('chatId'));
    }


    if(template.subscription && template.subscription.ready()) {
      Session.set('Messages/subscriptionReady', true);

      // XXX Provide decent way to detect if we can initialize
      // handleNewMessages
      if(!template.initialized) {
        Meteor.setTimeout(function() {
          template.initialized = true;
        }, 1000);
      }

      //chatAndRide.setupLastMessageWaypoint();

      var usersOnRoom = [];
      var msgs = template.messagesQuery.fetch();
      for (var index = 0; index < msgs.length; index++) {
        usersOnRoom[usersOnRoom.length] = msgs[index].userId;
      }
      usersOnRoom = _.uniq(usersOnRoom);
      Meteor.subscribe('Users/Basic', usersOnRoom);

      // Reset our scroll position
      var routeName = FlowRouter.current().path;

      if(! Session.get('isLoadingMessagesAnimationInProgress') 
        || template.$('.loadingMessages').length === 0 ) {
        if(! _.isUndefined(scrollPositions[routeName])) {
          var $el = template.$('.restoreScroll').children().first();
          $el.velocity('scroll', {
            container: $('.restoreScroll'),
            offset: scrollPositions[routeName] - $el.outerHeight()/2,
            duration: 0
          });
        }

        chatAndRide.elements.chatArea.contentScrollable
        .find('.messages').velocity({ 'opacity': '1' }, { duration: 200 });
      }

    }

  }); 

  // To skip initiallly added docs while observeChanges
  handleNewMessages = template.messagesQuery.observeChanges({
    added: function(id, user) {
      if(template.initialized) {
        Session.set('Messages/beingSent', true);
      }
    }
  });

  window.addEventListener('native.keyboardhide', function (event) {
    if(! Keyboard.isRefocusing)
      chatAndRide.showTopBar();
  });

  var originalOverflow = null;
  window.addEventListener('native.keyboardshow', function (event) {
    chatAndRide.elements.chatArea.messageBox.focus(); // ensure input is always focused

    chatAndRide.hideTopBar();

    // Force style reading once
    if(! originalOverflow)
      originalOverflow = chatAndRide.elements.chatArea.contentScrollable.css('overflow'); 

    // Prevent scrolling momentum effect
    chatAndRide.elements.chatArea.contentScrollable.css('overflow', 'hidden'); 

    // scroll to last message when keyboard opens
    chatAndRide.elements.chatArea.getLastMsg().velocity('scroll', {
      axis: 'y',
      container: chatAndRide.elements.chatArea.contentScrollable,
      duration: 600,
      delay: 300,
      offset: 0,
      easing: 'easeOutExpo' 
    });

    // Revert to original overflow after our scroll finishes
    chatAndRide.elements.chatArea.contentScrollable.css('overflow', originalOverflow); 

  });


});
