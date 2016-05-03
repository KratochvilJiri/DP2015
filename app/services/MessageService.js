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
            MessageModel.findById(message._id, function(err, dbMessage) {
                // error check
                if (err) {
                    validation.addError("Zprávu se nezdařilo nalézt v databázi");
                    callback(validation);
                    return;
                }

                // Update and save message
                dbMessage.seen = message.seen;


                // Save user
                dbMessage.save(function(err) {
                    if (err) {
                        validation.addError("Zprávu se nepodařilo uložit");
                        callback(validation);
                        return;
                    }

                    callback(validation);
                    return;
                });
            });
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
                                    //callback(validation);
                                    //return;
                                    else {
                                        MessageModel.find({ participation: dbParticipation._id })
                                            .populate({
                                                path: 'author', model: 'User', select: "role"
                                            })
                                            .exec(function(err, dbMessages) {

                                                if (err) {
                                                    validation.addError("Nepodařilo se získat původní zpravy a označit za přečtené.");
                                                    callback(validation);
                                                    return;
                                                }
                                                else {
                                                    dbMessages.reverse();

                                                    var marking = false;
                                                    var index = 0;
                                                    if (message.userRole == "PARTICIPANT") {
                                                        if (dbMessages.length > 1) {
                                                            index = 1;
                                                            if (dbMessages[index].author.role == "PARTICIPANT") {
                                                                callback(validation);
                                                                return;
                                                            }
                                                            else {
                                                                marking = true;
                                                                while (index < dbMessages.length && marking) {
                                                                    if (dbMessages[index].author.role == "PARTICIPANT") {
                                                                        marking = false;
                                                                    }
                                                                    else {
                                                                        dbMessages[index].seen = true;
                                                                        dbMessages[index].save(function(err) {
                                                                            // error check
                                                                            if (err) {
                                                                                validation.addError("Nepodařilo se označit zprávu za přečtenou.");
                                                                                callback(validation);
                                                                                return;
                                                                            }
                                                                        });
                                                                        index++;
                                                                    }
                                                                }
                                                            }
                                                        }

                                                    }
                                                    else {
                                                        if (dbMessages.length > 1) {
                                                            index = 1;
                                                            if (dbMessages[index].author.role != "PARTICIPANT") {
                                                                callback(validation);
                                                                return;
                                                            }
                                                            else {
                                                                marking = true;
                                                                while (index < dbMessages.length && marking) {
                                                                    if (dbMessages[index].author.role != "PARTICIPANT") {
                                                                        marking = false;
                                                                    }
                                                                    else {
                                                                        dbMessages[index].seen = true;
                                                                        dbMessages[index].save(function(err) {
                                                                            // error check
                                                                            if (err) {
                                                                                validation.addError("Nepodařilo se označit zprávu za přečtenou.");
                                                                                callback(validation);
                                                                                return;
                                                                            }
                                                                        });
                                                                        index++;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }

                                                    callback(validation);
                                                    return;
                                                }
                                            });
                                    }

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
                                    else {
                                        MessageModel.find({ issue: dbIssue._id })
                                            .populate({
                                                path: 'author', model: 'User', select: "role"
                                            })
                                          
                                            .exec(function(err, dbMessages) {

                                                if (err) {
                                                    validation.addError("Nepodařilo se získat původní zpravy a označit za přečtené.");
                                                    callback(validation);
                                                    return;
                                                }
                                                else {
                                                    dbMessages.reverse();

                                                    var marking = false;
                                                    var index = 0;
                                                    if (message.userRole == "PARTICIPANT") {
                                                        if (dbMessages.length > 1) {
                                                            index = 1;
                                                            if (dbMessages[index].author.role == "PARTICIPANT") {
                                                                callback(validation);
                                                                return;
                                                            }
                                                            else {
                                                                marking = true;
                                                                while (index < dbMessages.length && marking) {
                                                                    if (dbMessages[index].author.role == "PARTICIPANT") {
                                                                        marking = false;
                                                                    }
                                                                    else {
                                                                        dbMessages[index].seen = true;
                                                                        dbMessages[index].save(function(err) {
                                                                            // error check
                                                                            if (err) {
                                                                                validation.addError("Nepodařilo se označit zprávu za přečtenou.");
                                                                                callback(validation);
                                                                                return;
                                                                            }
                                                                        });
                                                                        index++;
                                                                    }
                                                                }
                                                            }
                                                        }

                                                    }
                                                    else {
                                                        if (dbMessages.length > 1) {
                                                            index = 1;
                                                            if (dbMessages[index].author.role != "PARTICIPANT") {
                                                                callback(validation);
                                                                return;
                                                            }
                                                            else {
                                                                marking = true;
                                                                while (index < dbMessages.length && marking) {
                                                                    if (dbMessages[index].author.role != "PARTICIPANT") {
                                                                        marking = false;
                                                                    }
                                                                    else {
                                                                        dbMessages[index].seen = true;
                                                                        dbMessages[index].save(function(err) {
                                                                            // error check
                                                                            if (err) {
                                                                                validation.addError("Nepodařilo se označit zprávu za přečtenou.");
                                                                                callback(validation);
                                                                                return;
                                                                            }
                                                                        });
                                                                        index++;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }

                                                    callback(validation);
                                                    return;
                                                }
                                            });
                                    }
                                    // message created and pushed to the issue
                                    //callback(validation);
                                    //return;
                                });
                            }
                        });
                    }
                }
            });
        }
    },

    markSeenMessages: function() {

    },

    // user structure validation
    validate: function(message) {
        // validation init
        validation = new ValidationResult(message);
        return validation;
    }
}