var ConferenceModel = require('./../models/ConferenceModel');
var ValidationResult = require('./../models/ValidationResultsStructure');

module.exports = {
     
    // save or create conference
    save: function(conference, callback) {
        // conference validation
        var validation = this.validate(conference);

        if (!validation.isValid) {
            callback(validation);
            return;
        }

        // check if _Id is set
        if (conference._id) {
            // to do
        }
        else {
            ConferenceModel.create(conference, function(err, dbConference) {
                // conference creation error
                if (err) {
                    validation.addError("Nepodařilo se vytvořit konferenci");
                    callback(validation);
                    return;
                }

                // conference created
                callback(validation);
                return
            });
        }
    },

    // conference structure validation
    validate: function(conference) {
        // validation init
        validation = new ValidationResult(conference);

        // check required values
        validation.checkIfIsDefinedAndNotEmpty('email', "Email je povinný");
        validation.checkIfIsDefinedAndNotEmpty('name', "Přijmení a jméno je povinné");
        validation.checkIfIsDefinedAndNotEmpty('password', "Heslo je povinné");
        validation.checkIfIsDefinedAndNotEmpty('role', "Uživatelská role je povinná");

        return validation;
    },

    // get all conference
    getList: function(callback) {
        var validation = new ValidationResult([]);

        // find all conference
        ConferenceModel.find(function(err, allConference) {
            // get all conference error
            if (err) {
                validation.addError("Nepodařilo se získat seznam konferencí");
                callback(validation);
                return;
            }
            // all conference obtained
            validation.data = allConference;

            callback(validation);
            return;
        });
    }
}