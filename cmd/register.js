// Generated by CoffeeScript 1.10.0
(function() {
  var bcrypt, util, validator;

  bcrypt = require('bcryptjs');

  validator = require('validator');

  util = require('./../util');

  module.exports = function(seneca, options) {
    var account, acl, cmd_register, password_length;
    acl = options.acl;
    password_length = options.password_length || 8;
    account = seneca.pin({
      role: 'account',
      cmd: '*'
    });
    cmd_register = function(args, respond) {
      var email, password;
      email = args.email;
      password = args.password || util.generate_password(password_length);
      if (!validator.isEmail(email)) {
        seneca.log.warn('bad email', email);
        return respond(null, null);
      }
      return account.identify({
        account_id: email
      }, function(error, account) {
        if (account) {
          seneca.log.warn('account already registered', account.id);
          return respond(null, null);
        } else {
          return bcrypt.genSalt(10, function(error, salt) {
            if (error) {
              seneca.log.error('salt generation failed:', error.message);
              return respond(error, null);
            }
            return bcrypt.hash(password, salt, function(error, hash) {
              var new_account;
              if (error) {
                seneca.log.error('password hash failed:', error.message);
                return respond(error, null);
              }
              new_account = seneca.make('account');
              new_account.id = email;
              new_account.password_hash = hash;
              return new_account.save$(function(error, saved_account) {
                if (error) {
                  seneca.log.error('new account record failed:', error.message);
                  return respond(error, null);
                }
                return acl.addUserRoles(saved_account.id, ['player'], function(error) {
                  if (error) {
                    seneca.log.error('adding role to new account failed:', error.message);
                    account.remove({
                      account_id: saved_account.id
                    }, function(error, removed_account) {
                      return respond(error, null);
                    });
                  }
                  saved_account.password = password;
                  return respond(null, saved_account);
                });
              });
            });
          });
        }
      });
    };
    return cmd_register;
  };

}).call(this);

//# sourceMappingURL=register.js.map
