var UserModel = require('./../models/UserModel');
var ValidationResult = require('./../models/ValidationResultsStructure');

module.exports = {
     
    // create user
    save: function(user, callback) {
        // user validation
        var validation = this.validate(user);

        if (!validation.isValid) {
            callback(validation);
            return;
        }

        // check if _Id is set
        if (user._id) {
            // to do
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

        // check required values
        validation.checkIfIsDefinedAndNotEmpty('email', "Email je povinný");
        validation.checkIfIsDefinedAndNotEmpty('name', "Přijmení a jméno je povinné");
        validation.checkIfIsDefinedAndNotEmpty('password', "Heslo je povinné");
        validation.checkIfIsDefinedAndNotEmpty('role', "Uživatelská role je povinná");

        return validation;
    },

    // get users
    getList: function(callback) {
        var validation = new ValidationResult([]);

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
    },

    // remove use by id
    remove: function(user, callback) {
        var validation = new ValidationResult(user);

        // _id is needed for remove
        if (!user._id) {
            validation.addError("Položku nelze smazat bez identifikátoru");
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