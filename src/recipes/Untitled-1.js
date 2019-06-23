knex.select().from("users").leftJoin("user_addresses","users.id","user_addresses.user_id").then(function(data) {
    return _.chain(data).groupBy(function(user) { reuturn user.id; }).map(function(users) {
      var user = _.chain(users).first().pick('id', 'username', 'email');
      var user_addresses = _.map(users, function(u) {
         return { 'street': u.street, 'postcode': u.postcode };
      });
      user.user_addresses = user_addresses;
      return user;
   }).value();
});