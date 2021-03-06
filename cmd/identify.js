// Generated by CoffeeScript 1.10.0
(function() {
  module.exports = function(seneca, options) {
    var cmd_identify;
    cmd_identify = function(msg, respond) {
      var account_records, id;
      id = msg.account_id;
      account_records = seneca.make('account');
      return account_records.load$(id, function(error, account) {
        if (error) {
          seneca.log.error('error while loading account', id, error.message);
          return respond(null, null);
        } else {
          return respond(null, account);
        }
      });
    };
    return cmd_identify;
  };

}).call(this);

//# sourceMappingURL=identify.js.map
