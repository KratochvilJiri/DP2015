var UserModel = require('./../models/UserModel');
var ConferenceModel = require('./../models/ConferenceModel');
var ValidationResult = require('./../models/ValidationResultsStructure');
var EmailService = require('./EmailService');
var nodemailer = require('nodemailer');

module.exports = {

    // create user
    save: function (user, callback) {
        // user validation
        var validation = this.validate(user);

        if (!validation.isValid) {
            callback(validation);
            return;
        }

        UserModel.find({ email: user.email }, function (err, users) {
            if (err) {
                validation.addError("Nepodařilo se získat počet duplicit v emailu uživatele.");
                callback(validation);
                return;
            }
            if (users.length > 0 && (!user._id || user._id != users[0]._id)) {
                validation.addError("Uživatel s tímto emailem již existuje");
                callback(validation);
                return;
            }
            else {
                // check if _Id is set
                if (user._id) {
                    UserModel.findById(user._id, function (err, dbUser) {
                        // error check
                        if (err) {
                            validation.addError("Uživatele se nezdařilo nalézt v databázi");
                            callback(validation);
                            return;
                        }

                        if (user.newPassword) {
                            dbUser.password = user.newPassword;
                        }
                        // Update and save user
                        dbUser.name = user.name;
                        dbUser.role = user.role;
                        dbUser.email = user.email;
                        dbUser.phone = user.phone;

                        if (user.role == "PARTICIPANT") {
                            dbUser.contactPerson = user.contactPerson;
                            dbUser.ICO = user.ICO;
                            dbUser.DIC = user.DIC;
                            dbUser.address = user.address;
                        }

                        // Save user
                        dbUser.save(function (err) {
                            if (err) {
                                validation.addError("Uživatele se nepodařilo uložit");
                                callback(validation);
                                return;
                            }

                            callback(validation);
                            return;
                        });
                    })
                }
                else {
                    // pass generation
                    var length = 8,
                        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                        password = "";
                    for (var i = 0, n = charset.length; i < length; ++i) {
                        user.password += charset.charAt(Math.floor(Math.random() * n));
                    }

                    UserModel.create(user, function (err, dbUser) {
                        // user creation error
                        if (err) {
                            validation.addError("Nepodařilo se vytvořit uživatele." + err);
                            callback(validation);
                            return;
                        }

                        ConferenceModel.findOne({ "active": true }, "email emailPort emailPassword _id", function (err, dbConference) {
                            if (err) {
                                validation.addError(err);
                                callback(validation);
                                return;
                            }

                            var temp = dbConference.email.split("@");
                            var imapServer = temp[1];

                            var smtpConfig = {
                                host: ("smtp." + imapServer),
                                port: 465,
                                secure: true, // SSL
                                auth: {
                                    user: dbConference.email,
                                    pass: dbConference.emailPassword
                                }
                            };

                            var transporter = nodemailer.createTransport(smtpConfig);

                            var emailBody = "Dobrý den, <br /> vítáme Vás v systému pro podporu komunikace a zajištění externích účastníků akce. <br /> Vaše přihlašovací údaje jsou: email:" + user.email + "<br /> heslo:" + user.password + "<br /> <br /> S pozdravem, <br /> vývojařský tým aplikace.";
                            var mailOptions = {
                                from: (dbConference.name + dbConference.email), // sender address
                                to: user.email, // list of receivers
                                subject: "Registrační údaje - systém pro podporu komunikace.", // Subject line
                                text: emailBody, // plaintext body
                                html: emailBody // html body
                            };

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    validation.addError(error);
                                    callback(validation);
                                    return;
                                }
                                else {
                                    callback(validation);
                                    return;
                                }
                            });
                        });
                    });
                }
            }
        });
    },

    // user structure validation
    validate: function (user) {
        // validation init
        validation = new ValidationResult(user);

        if (user.role == "PARTICIPANT") {
            validation.checkIfIsDefinedAndNotEmpty('ICO', "ICO účastníka je povinné");
            validation.checkIfIsDefinedAndNotEmpty('contactPerson', "Jméno kontaktní osoby je povinné");
            if (!user.address.city) {
                validation.addError("Město sídla účastníka je povinné");
            }
            else if (!user.address.street) {
                validation.addError("Ulice sídla účastníka je povinná");
            }
            else if (!user.address.postal) {
                validation.addError("Směrovací číslo sídla účastníka je povinné");
            }
        }

        if (user.newPassword != user.newPassword1) {
            validation.addError("Nová hesla se neshodují");
        }
        // check required values
        validation.checkIfIsDefinedAndNotEmpty('email', "Email je povinný");
        validation.checkIfIsDefinedAndNotEmpty('name', "Přijmení a jméno je povinné");
        validation.checkIfIsDefinedAndNotEmpty('role', "Uživatelská role je povinná");

        return validation;
    },

    // get users
    getList: function (filter, callback) {
        var validation = new ValidationResult([]);

        if (filter == "PARTICIPANTS") {
            UserModel.find({ 'role': 'PARTICIPANT' }, function (err, users) {
                // get all users error
                if (err) {
                    validation.addError("Nepodařilo se získat seznam účastníků");
                    callback(validation);
                    return;
                }
                // all users obtained
                validation.data = users;

                callback(validation);
                return;
            });

        }

        else if (filter == "NOT_PARTICIPANT") {
            UserModel.find({ 'role': { $ne: 'PARTICIPANT' } }, 'name', function (err, users) {
                // get all users error
                if (err) {
                    validation.addError("Nepodařilo se získat seznam účastníků");
                    callback(validation);
                    return;
                }
                // all users obtained
                validation.data = users;

                callback(validation);
                return;
            });
        }

        else {
            // find all users
            UserModel.find(function (err, users) {
                // get all users error
                if (err) {
                    validation.addError("Nepodařilo se získat seznam uživatelů");
                    callback(validation);
                    return;
                }
                // all users obtained
                validation.data = users;

                callback(validation);
                return;
            });
        }
    },

    getUninvited: function (conferenceID, callback) {
        var validation = new ValidationResult([]);

        UserModel.find({ 'role': 'PARTICIPANT' })
            .populate({
                path: 'participations', model: 'Participation', match: { "conference": conferenceID }, select: "_id"
            })
            .exec(function (err, users) {
                // get all users error
                if (err) {
                    validation.addError("Nepodařilo se získat seznam účastníků");
                    callback(validation);
                    return;
                }
                // all users obtained
                validation.data = users;

                callback(validation);
                return;
            });


    },

    // get user by ID
    get: function (user, callback) {
        var validation = new ValidationResult(user);
        // _id is needed for get user
        if (!user._id) {
            validation.addError("Uživatele nelze získat bez identifikátoru");
            callback(validation);
            return;
        }

        UserModel.findById(user._id, function (err, dbUser) {
            if (err) {
                validation.addError("Uživatele se nepodařilo získat");
                callback(validation);
                return;
            }
            // user obtained
            validation.data = dbUser;
            callback(validation);
        })

    },

    // remove use by id
    remove: function (user, callback) {
        var validation = new ValidationResult(user);

        // _id is needed for remove
        if (!user._id) {
            validation.addError("Uživatele nelze smazat bez identifikátoru");
            callback(validation);
            return;
        }

        UserModel.remove(user, function (err, dbUser) {
            // user remove error
            if (err) {
                validation.addError("Uživatele se nezdařilo odebrat");
                callback(validation);
                return;
            }
            // user removed
            callback(validation);
        });
    },

    sendCredentials: function (user) {
        var email = {};
        email.recipient = user.email;
        email.text = "Dobrý den, \n vítáme Vás v systému pro podporu komunikace a zajištění externích účastníků akce. \n Vaše přihlašovací údaje jsou: email:" + user.email + "\n heslo:" + user.password + "\n S pozdravem, \n vývojařský tým aplikace.";
        EmailService.send(email, function (validation) {
            return validation;
        });
    },

    generatePassword: function () {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            password = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        return password;
    },

    init: function (user) {
        UserModel.count({}, function (err, count) {
            if (err) {
                console.log(err);
            }
            if (count > 0) {
                return;
            }
            user.role = "ADMINISTRATOR";
            user.email = "admin";
            user.password = "1234";
            user.name = "admin";
            UserModel.create(user, function (err, user) {
                if (err)
                    console.log(err);
            });
        })
    }
}