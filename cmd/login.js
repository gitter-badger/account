// Generated by CoffeeScript 1.10.0
(function() {
  var jwt, login;

  jwt = require('jsonwebtoken');

  login = function(options) {
    var seneca;
    seneca = this;
    return seneca.add('plugin:login', function(params, respond) {
      var account_id, password;
      account_id = params.account_id;
      password = params.password;
      return seneca.act('plugin:authenticate', {
        account_id: account_id,
        password: password
      }, function(error, res) {
        var secret;
        if (res && res.authenticated) {
          secret = options.secret;
          res.token = jwt.sign({
            id: account_id
          }, secret, {
            noTimestamp: options.jwtNoTimestamp
          });
          return respond(null, res);
        } else {
          return respond(null, res);
        }
      });
    });
  };

  module.exports = login;

}).call(this);

//# sourceMappingURL=login.js.map