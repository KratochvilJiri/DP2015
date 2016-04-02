var MessageModel = require('./../models/MessageModel');
var ParticipationModel = require('./../models/ParticipationModel');
var ValidationResult = require('./../models/ValidationResultsStructure');

module.exports = {
    // create user
    save: function(message, callback) {

        // participation validation
        var validation = this.validate(message);

        if (!validation.isValid) {
            callback(validation);
            return;
        }

        // check if _Id is set
        if (message._id) {
        }
        else {
            MessageModel.create(message, function(err, dbMessage) {
                // participation creation error
                if (err) {
                    validation.addError("Nepodařilo se uložit zprávu.");
                    callback(validation);
                    return;
                }
                else {

                    // to do add participation to user??
                    ParticipationModel.findById(message.participation, function(err, dbParticipation) {
                        if (err) {
                            validation.addError("Nepodařilo se získat účast pro přidání zprávy");
                            callback(validation);
                            return;
                        }
                        else {

                            dbParticipation.messages.push(dbMessage._id);

                            dbParticipation.save(function(err) {
                                // error check
                                if (err) {
                                    validation.addError("Nepodařilo se uložit účast po přidání zprávy");
                                    callback(validation);
                                    return;
                                }
                                // message created and pushed to the participation
                                callback(validation);
                                return;
                            });
                        }
                    });
                }
            });
        }
    },
    
        // user structure validation
    validate: function(message) {
        // validation init
        validation = new ValidationResult(message);
        return validation;
    }
}