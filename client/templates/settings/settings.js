//Template.settings.events({
  //'click [data-action=report-bug]': function (event, template) {
     //Router.go('report.bug');
  //}
//});

Template.settings.events({
  'click .logout': function() {
    Meteor.logout();
    Router.go('login');
  }
});

Template.reportBug.rendered = function() {

 if(Session.equals('buggyMode', true)) {
  $('input[name="buggy-mode"]')[0].checked = true;
 } 

}

Template.reportBug.events({
  'change input[name="buggy-mode"]': function(event, template) {
    if(event.target.checked) {

     if(Meteor.isCordova) {
       window.Lookback.setupWithAppToken('XKtxhBdyGqqk8nK9L');
       window.Lookback.shakeToRecord(true);
     }

     Session.set('buggyMode', true);

    } else {

     if(Meteor.isCordova)
       window.Lookback.shakeToRecord(false);

     Session.set('buggyMode', false);
    }
  }
});
