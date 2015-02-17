Template.chatShow.events({  
  'click button': function(e, t) {
    e.preventDefault();
    var $msg = t.find('#msg');

    if($msg.value.trim() === '') { // no message at all, re-focus
      $msg.focus();
    } else {
      IonKeyboard.reFocusOn($msg);
      Meteor.call('sendMessage', Session.get('chatId'), Meteor.userId(), $msg.value);
      $msg.value = '';
    }
  },
  'click .bar-footer': function(e ,t) {
    alert('I clicked on bar footer');
    e.preventDefault();
    var $msg = t.find('#msg');
    IonKeyboard.reFocusOn($msg);
  },
  'blur input#msg': function(e) {
  }
});


Template.chatShow.helpers({
  isOther: function(userId) {
    if(Meteor.userId() === userId)
      return false;
    
    return true;
  }
});

Template.chatShow.rendered = function() {
  scrollTo(0, 1); // XXX transition misterious hack

  window.addEventListener('native.keyboardshow', function (event) {

    keyboardOpen = true;
    $('input#msg').focus(); // ensure input is always focused

    // scroll to last message when keyboard opens
    $('.messages:last-child').velocity('scroll', {
       axis: 'y',
       container: $('.content.overflow-scroll'),
       duration: IonKeyboard.transitionsDuration,
       offset: 9999999,
       easing: IonKeyboard.transitionsIn 
    });

  });

}
