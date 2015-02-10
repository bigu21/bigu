Template.appLayout.rendered = function () {
  this.autorun(function() {
    if(Session.equals('renderTabs', true)) {
      $('.tabs').css('visibility', 'visible');  
    } else {
      $('.tabs').css('visibility', 'hidden');  
    }
  });
};

// Render tabs por default
Session.set('renderTabs', true);
