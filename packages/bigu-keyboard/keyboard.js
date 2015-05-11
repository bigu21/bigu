Meteor.startup(function () {
  if (Meteor.isCordova) {
    Keyboard.disableScroll();
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

  disableScroll: function () {
    if (Meteor.isCordova) {
      cordova.plugins.Keyboard.disableScroll(true);
    }
  },

  enableScroll: function () {
    if (Meteor.isCordova) {
      cordova.plugins.Keyboard.disableScroll(false);
    }
  },
  _reFocus: false,
  reFocusOn: function(el) {
    Keyboard._reFocus = true;
    el.focus();
  }
};

var observer = [];
window.addEventListener('native.keyboardshow', function (event) {
  // TODO: Android is having problems
  if (Device.android()) {
    return;
  }

  var keyboardHeight = event.keyboardHeight;
  if(!Keyboard._reFocus) {

    //Attach any elements that want to be attached
    var attachedSize = 0;
    $('[data-keyboard-attach="true"]').each(function (index, el) {
      if(! Keyboard.isOpen()) {
        var translateY = new WebKitCSSMatrix($(el).css('transform'))[5]
        $(el).data('keyboard.translateY', translateY);
      }

      $(el).velocity({ 
        translateY: -keyboardHeight
      }, { 
        queue: false,
        duration: Keyboard.transisionsDuration,
        easing: Keyboard.transitionsIn 
      });

      attachedSize += $(el).height();
    });

    var totalAttachedSize = attachedSize + keyboardHeight;

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
            var translateY = new WebKitCSSMatrix($(el).css('transform'))[5]
            $(el).data('keyboard.translateY', translateY);

            var originalTop = parseInt( $(el).css('top').replace('px', '') );
            $(el).data('keyboard.top', originalTop);
          }
          
          var newTop = $(el).data('keyboard.top') + keyboardHeight;
          $(el)
          .velocity({top: newTop, translateY: -keyboardHeight }, {
            duration: Keyboard.transisionsDuration,
            easing: Keyboard.transitionsIn,
          });

          //$(el).css({bottom: keyboardHeight + 43});
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


    $('.content-scrollable').on('focus', 'input,textarea', function(event) {
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
    Keyboard._reFocus = false;
  }

  $('body').addClass('keyboard-open');
});

window.addEventListener('native.keyboardhide', function (event) {
  // TODO: Android is having problems
  if (Device.android()) {
    return;
  }

  $('body').removeClass('keyboard-open');

  if(!Keyboard._reFocus) {

    for(var i = 0; i < observer.length; i++) {
      observer[i].disconnect();
    }

    // Reset the content area(s)
    $('.content-scrollable').each(function (index, el) {

      $(el).velocity({top: $(el).data('keyboard.top'), translateY: $(el).data('keyboard.translateY') }, {
        duration: Keyboard.transisionsDuration,
        easing: Keyboard.transitionsOut,
      });

    });

    // Detach any elements that were attached
    $('[data-keyboard-attach="true"]').each(function (index, el) {
      $(el).velocity({ translateY: $(el).data('keyboard.translateY') }, { duration: Keyboard.transisionsDuration, easing: Keyboard.transitionsOut });
    });

  }

});


window.addEventListener('native.keyboardchange', function (event) {
  var keyboardHeight = event.keyboardHeight;
});
