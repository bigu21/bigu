Meteor.startup(function () {
STATES = [
  'AK', 'AL', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

  //if (Chat.find({}).count() === 0) {
    //_(20).times(function(n) {
      //var user = Fake.user();
      //var gender = Random.choice(['men', 'women']);
      //var num = _.random(0, 50);
      //var avatarUrl = 'https://randomuser.me/api/portraits/thumb/' + gender + '/' + num + '.jpg';

      //Chat.insert({
        //avatarUrl: avatarUrl,
        //topic: 'Pizza é sempre bom',
        //name: {
          //first: user.name,
          //last: user.surname
        //},
        //emails: [{label: 'Work', address: user.email}],
        //type: Fake.fromArray(['High', 'Medium', 'Low']),
        //location: {
          //city: Fake.word(),
          //state: Fake.fromArray(STATES)
        //},
        //details: {
          //notes: Fake.paragraph(),
          //active: Fake.fromArray([true, false])
        //}
      //});
    //});
  //}

});
