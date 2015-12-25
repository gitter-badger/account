// Generated by CoffeeScript 1.10.0
(function() {
  module.exports = function() {
    var seneca;
    seneca = this;
    seneca.add('plugin:identify', function(params, respond) {
      var account_records, id;
      id = params.account_id;
      account_records = seneca.make('account');
      return account_records.load$(id, function(error, account) {
        if (error) {
          seneca.log.error('error while loading account', id, error.message);
          return respond(null, null);
        } else {
          return respond(null, account);
        }
      });
    });
    return 'identify';
  };

}).call(this);

//# sourceMappingURL=identify.js.map