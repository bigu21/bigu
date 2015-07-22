Meteor.startup(function () {
  if (Meteor.isCordova) {
    Keyboard.enableNativeScroll();
    //Keyboard.disableNativeScroll();
    Keyboard.hideKeyboardAccessoryBar();
  }
});


Keyboard = {
  transitionsDuration: 300,
  transitionsIn: "easeInSine",
  transitionsOut: "easeOutSine",
  isOpen: function() {
    return $('body').hasClass('keyboard-open');
  },
  close: function () {
    if (Meteor.isCordova) {
      cordova.plugins.Keyboard.close();
    }
  },
  show: function () {
    if (Meteor.isCordova) {
      cordova.plugins.Keyboard.show();
    }
  },
  hideKeyboardAccessoryBar: function () {
    if (Meteor.isCordova) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
  },
  showKeyboardAccessoryBar: function () {
    if (Meteor.isCordova) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }
  },
  disableNativeScroll: function () {
    if (Meteor.isCordova) {
      Keyboard.isNativeScrollEnabled = false;
      cordova.plugins.Keyboard.disableScroll(true);
    }
  },
  enableNativeScroll: function () {
    if (Meteor.isCordova) {
      Keyboard.isNativeScrollEnabled = true;
      cordova.plugins.Keyboard.disableScroll(false);
    }
  },
  isNativeScrollEnabled: null,
  __translateContent: function(keyboardHeight, bypassNativeScrollCheck) {
    // In case we have to skip animations(due to nativeScroll) but still want
    // to calc things like visibleArea
    var skipAnimations = 
      (! bypassNativeScrollCheck && Keyboard.isNativeScrollEnabled) ? true : false;

    // XXX TODO implement selective skipAnimation/nativeScroll bypass
    if(skipAnimations)
      return;

    var totalAttachedSize = Keyboard.attachedSizeWithKeyboard;

    // Move the bottom of the content area(s) above the top of the keyboard
    $('.content-scrollable').each(function (index, el) {
      var translateContent = function() {

        var visibleArea = el.clientHeight - totalAttachedSize;
        var scrollableArea = el.scrollHeight - totalAttachedSize;

        var totalChildrenHeight = 0; 
        $(el).children().each(function() { 
          totalChildrenHeight += $(this).outerHeight(); 
        });

        if( totalChildrenHeight > visibleArea ) {
          if(! Keyboard.isOpen()) {
            var originalTranslateY = $.Velocity.hook(el, 'translateY');
            $(el).data('keyboard.translateY', originalTranslateY);
          }

          $(el)
          .velocity({ translateY: -keyboardHeight }, {
            duration: Keyboard.transisionsDuration,
            easing: Keyboard.transitionsIn,
          });

        }
      }

      translateContent();

      var observerTarget = $('.content-scrollable')[0];
      var thisIndex = observer.length;
      observer[thisIndex] = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          var newNodes = mutation.addedNodes;
          if(newNodes !== null) {
            var $nodes = $(newNodes);
            $nodes.each(function() {
              var $node = $(this);
              translateContent();
            });
          }
        });
      });

      var config = { 
        attributes: false, 
        childList: true, 
        characterData: false 
      };

      observer[thisIndex].observe(observerTarget, config); 
    });
  },
  translateContentBeforeEvent: function(bypassNativeScrollCheck) {
    Keyboard.__alreadyTranslatedContent =  true;
    Keyboard.__translateContent(null, bypassNativeScrollCheck);
  },
  __alreadyTranslatedContent: false,
  __translateAttach: function(keyboardHeight, bypassNativeScrollCheck) {
    if(_.isUndefined(keyboardHeight))
      keyboardHeight = Keyboard.lastKnownKeyboardHeight;

    if(! keyboardHeight) {
      Keyboard.__alreadyTranslatedAttach = false;
      return;
    }

    $('[data-keyboard-attach="true"]').each(function (index, el) {
      // Ensure any attached element will not trigger scroll events
      $(el).css('overflow', 'hidden');

      // We'll really translateAttach only if we do not have native scrolling
      // already doing this OR if we intetionally bypass this check 
      if(bypassNativeScrollCheck || ! Keyboard.isNativeScrollEnabled) {
        if(! Keyboard.isOpen()) {
          var originalTranslateY = $.Velocity.hook(el, 'translateY');
          $(el).data('keyboard.originalTranslateY', originalTranslateY);
        }

        $(el).velocity({ 
          translateY: -keyboardHeight
        }, { 
          queue: false,
          duration: Keyboard.transisionsDuration/2,
          easing: Keyboard.transitionsIn 
        });
      }

      Keyboard.attachedSize += $(el).height();
    });
  },
  translateAttachBeforeEvent: function(bypassNativeScrollCheck) {
    Keyboard.__alreadyTranslatedAttach =  true;
    Keyboard.__translateAttach(null, bypassNativeScrollCheck);
  },
  __alreadyTranslatedAttach: false,
  isRefocusing: false,
  reFocusOn: function(el) {
    Keyboard.isRefocusing = true;
    el.focus();
  },
  lastKnownKeyboardHeight: null,
  attachedSize: 0,
  attachedSizeWithKeyboard: 0 
};

var observer = [];
window.addEventListener('native.keyboardshow', function (event) {
  // TODO: Android is having problems
  if (Device.android()) {
    return;
  }

  var keyboardHeight = event.keyboardHeight;
  Keyboard.lastKnownKeyboardHeight = keyboardHeight;

  if(! Keyboard.isRefocusing) {

    // Attach any elements that want to be attached
    // and execute translation
    if(! Keyboard.__alreadyTranslatedAttach) 
      Keyboard.__translateAttach(keyboardHeight);

    // Calc new total attachedSizeWithKeyboard
    Keyboard.attachedSizeWithKeyboard = Keyboard.attachedSize + keyboardHeight;

    // Translate content
    if(! Keyboard.__alreadyTranslatedContent) 
      Keyboard.__translateContent(keyboardHeight);

    $('.content-scrollable').on('focus', 'input, textarea', function(event) {
      var contentOffset = $(event.delegateTarget).offset().top;
      var padding = 10;
      var scrollTo = $(event.delegateTarget).scrollTop() + $(this).offset().top - (contentOffset + padding);

      $('html').velocity('scroll', {
        container: $(event.delegateTarget),
        offset: srollTo,
        duration: Keyboard.transisionsDuration,
        easing: Keyboard.transitionsIn
      });

    });

  } else {
    Keyboard.isRefocusing = false;
  }

  $('body').addClass('keyboard-open');
});

window.addEventListener('native.keyboardhide', function (event) {
  // Reset attachs
  Keyboard.attachedSize = 0;
  Keyboard.attachedSizeWithKeyboard = 0;

  // TODO: Android is having problems
  if (Device.android()) {
    return;
  }

  $('body').removeClass('keyboard-open');

  if(! Keyboard.isRefocusing) {

    for(var i = 0; i < observer.length; i++) {
      observer[i].disconnect();
    }

    // Reset the content area(s)
    $('.content-scrollable').each(function (index, el) {

      $(el).velocity({ translateY: $(el).data('keyboard.originalTranslateY') }, {
        duration: Keyboard.transisionsDuration,
        easing: Keyboard.transitionsOut,
      });

    });

    // Detach any elements that were attached
    $('[data-keyboard-attach="true"]').each(function (index, el) {
      $(el).velocity({ translateY: $(el).data('keyboard.originalTranslateY') }, { duration: 600, easing: [200, 50] });
    });

  }

});


window.addEventListener('native.keyboardchange', function (event) {
  var keyboardHeight = event.keyboardHeight;
  Keyboard.lastKnownKeyboardHeight = keyboardHeight;
});
