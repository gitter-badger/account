bcrypt = require 'bcryptjs'
validator = require 'validator'
util = require './util'

module.exports = (options) ->
    seneca = @
    mail = seneca.client(options.mail)
    acl = options.acl

    seneca.add 'plugin:register', (args, respond) ->
        email = args.email
        password = args.password or util.generate_password()

        # check validity
        if !validator.isEmail email
            respond seneca.fail "Bad email: #{email}"

        # check for registered accounts
        seneca.act 'plugin:identify', {account_id: email}, (error, account) ->
            if account
                respond seneca.fail 'Already registered'
            else
                # hash password
                bcrypt.genSalt 10, (error, salt) ->
                    bcrypt.hash password, salt, (error, hash) ->

                        # create new user record
                        new_account = seneca.make 'account'
                        new_account.id = email
                        new_account.password_hash = hash
                        new_account.group = 'general'
                        new_account.save$ (error, saved_account) ->
                            # assign `player` role
                            acl.addUserRoles saved_account.id, ['player'], (error) ->
                                if error
                                    seneca.log.error 'role assignment failed', saved_account.id
                                    respond error
                                else
                                    saved_account.password = password
                                    if !options.test
                                        mail.act
                                            action: 'send'
                                            to: email
                                            subject: 'Регистрация в Venture Game'
                                            text:    'Поздравляем с регистрацией!\n' +
                                            '---------------------------\n' +
                                            'Ваш пароль: ' + password
                                    respond null, saved_account

    'register'