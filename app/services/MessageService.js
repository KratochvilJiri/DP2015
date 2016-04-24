var MessageModel = require('./../models/MessageModel');
var ParticipationModel = require('./../models/ParticipationModel');
var IssueModel = require('./../models/IssueModel');
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

                    if (message.participation) {
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
                    else {
                        IssueModel.findById(message.issue, function(err, dbIssue) {
                            if (err) {
                                validation.addError("Nepodařilo se získat problém pro přidání zprávy");
                                callback(validation);
                                return;
                            }
                            else {

                                dbIssue.messages.push(dbMessage._id);

                                dbIssue.save(function(err) {
                                    // error check
                                    if (err) {
                                        validation.addError("Nepodařilo se uložit problém po přidání zprávy");
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