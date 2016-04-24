var UserModel = require('./../models/UserModel');
var ValidationResult = require('./../models/ValidationResultsStructure');

module.exports = {

    // create user
    save: function(user, callback) {

        user.password = "1";
        // user validation
        var validation = this.validate(user);

        if (!validation.isValid) {
            callback(validation);
            return;
        }

        // check if _Id is set
        if (user._id) {
            UserModel.findById(user._id, function(err, dbUser) {
                // error check
                if (err) {
                    validation.addError("Uživatele se nezdařilo nalézt v databázi");
                    callback(validation);
                    return;
                }

                // Update and save conference
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
                dbUser.save(function(err) {
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
            UserModel.create(user, function(err, dbUser) {
                // user creation error
                if (err) {
                    validation.addError("Nepodařilo se vytvořit uživatele.");
                    callback(validation);
                    return;
                }

                // user created
                callback(validation);
                return
            });
        }
    },

    // user structure validation
    validate: function(user) {
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
        // check required values
        validation.checkIfIsDefinedAndNotEmpty('email', "Email je povinný");
        validation.checkIfIsDefinedAndNotEmpty('name', "Přijmení a jméno je povinné");
        validation.checkIfIsDefinedAndNotEmpty('role', "Uživatelská role je povinná");

        return validation;
    },

    // get users
    getList: function(filter, callback) {
        var validation = new ValidationResult([]);

        if (filter == "PARTICIPANTS") {
            UserModel.find({ 'role': 'PARTICIPANT' }, function(err, users) {
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
            UserModel.find({ 'role': {$ne: 'PARTICIPANT'} }, 'name', function(err, users) {
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
            UserModel.find(function(err, users) {
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

    getUninvited: function(conferenceID, callback) {
        var validation = new ValidationResult([]);

        console.log(conferenceID);

        UserModel.find({ 'role': 'PARTICIPANT' })
            .populate({
                path: 'participations', model: 'Participation', match: { "conference": conferenceID }, select: "_id"
            })
            .exec(function(err, users) {
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
    get: function(user, callback) {
        var validation = new ValidationResult(user);
        // _id is needed for get user
        if (!user._id) {
            validation.addError("Uživatele nelze získat bez identifikátoru");
            callback(validation);
            return;
        }

        UserModel.findById(user._id, function(err, dbUser) {
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
    remove: function(user, callback) {
        var validation = new ValidationResult(user);

        // _id is needed for remove
        if (!user._id) {
            validation.addError("Uživatele nelze smazat bez identifikátoru");
            callback(validation);
            return;
        }

        UserModel.remove(user, function(err, dbUser) {
            // user remove error
            if (err) {
                validation.addError("Uživatele se nezdařilo odebrat");
                callback(validation);
                return;
            }
            // user removed
            callback(validation);
        });
    }
}