/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

var ParticipationModel = require('./../models/ParticipationModel');
var ConferenceModel = require('./../models/ConferenceModel');
var UserModel = require('./../models/UserModel');
var MessageModel = require('./../models/MessageModel');
var ValidationResult = require('./../models/ValidationResultsStructure');

module.exports = {

    // save participation
    save: function (participation, callback) {

        // participation validation
        var validation = this.validate(participation);

        if (!validation.isValid) {
            callback(validation);
            return;
        }

        // check if _Id is set
        if (participation._id) {
            ParticipationModel.findById(participation._id, function (err, dbParticipation) {
                // error check
                if (err) {
                    validation.addError("Uživatele se nezdařilo nalézt v databázi");
                    callback(validation);
                    return;
                }
                // Update and save pariticipation
                dbParticipation.attendees = participation.attendees;
                dbParticipation.attachements = participation.attachements;
                dbParticipation.messages = participation.messages;
                dbParticipation.sponsorshipLevel = participation.sponsorshipLevel;
                dbParticipation.state = participation.state;
                dbParticipation.communicationSummary = participation.communicationSummary;

                // Save participation
                dbParticipation.save(function (err) {
                    if (err) {
                        validation.addError("Účast se nepodařilo uložit" + err);
                        callback(validation);
                        return;
                    }

                    callback(validation);
                    return;
                });
            })
        }
        else {
            ParticipationModel.create(participation, function (err, dbParticipation) {
                // participation creation error
                if (err) {
                    validation.addError("Nepodařilo se vytvořit účast.");
                    callback(validation);
                    return;
                }
                else {

                    // to do add participation to user??
                    UserModel.findById(participation.user, function (err, dbUser) {
                        if (err) {
                            validation.addError("Nepodařilo se získat uživatele pro přidání účasti");
                            callback(validation);
                            return;
                        }
                        else {

                            dbUser.participations.push(dbParticipation._id);

                            dbUser.save(function (err) {
                                // error check
                                if (err) {
                                    validation.addError("Nepodařilo se uložit uživatele po přidání účasti");
                                    callback(validation);
                                    return;
                                }
                                else {
                                    // add participant to conference
                                    // find conference by ID
                                    ConferenceModel.findById(participation.conference, function (err, dbConference) {
                                        // error check
                                        if (err) {
                                            validation.addError("Nepodařilo se získat konferenci pro přidání účastníka");
                                            callback(validation);
                                            return;
                                        }
                                        else {

                                            // push participation to conference
                                            dbConference.participations.push(dbParticipation._id);

                                            // save conference      
                                            dbConference.save(function (err) {
                                                // error check
                                                if (err) {
                                                    validation.addError("Nepodařilo se uložit konferenci po přidání účastníka");
                                                    callback(validation);
                                                    return;
                                                }
                                                // participation created and pushed to the conference
                                                callback(validation);
                                                return;
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    },
    // get list participation by participant
    getList: function (participantID, callback) {
        var validation = new ValidationResult([]);
        ParticipationModel
            .find({ 'user': participantID })
            .populate('conference', 'name date notification active sponsorshipLevels attachementTypes place attendeesNumber invitation email')
            .populate({
                path: 'messages', model: 'Message', options: { sort: { 'date': -1 } }, populate: { path: 'author', model: 'User', select: 'name role' }
            })
            .populate({ path: 'attachements', model: 'Attachement' })
            .exec(function (err, participations) {
                if (err) {
                    validation.addError("Účasti se nepodařilo získat");
                    callback(validation);
                    return;
                }

                // participations obtained
                validation.data = participations;
                callback(validation);
            });
    },
    // get pariticipation by conference ID
    getListByConference: function (conferenceID, callback) {
        var validation = new ValidationResult([]);
        ParticipationModel
            .find({ 'conference': conferenceID })
            .populate('user', 'name email phone ICO contactPerson participations')
            .exec(function (err, participations) {
                if (err) {
                    validation.addError("Účasti se nepodařilo získat");
                    callback(validation);
                    return;
                }


                // participations obtained
                validation.data = participations;
                callback(validation);
            });
    },
    // unseen messages
    getUnseenMessages: function (data, callback) {
        var validation = new ValidationResult([]);

        if (data.role != "PARTICIPANT") {
            ParticipationModel
                .find({ 'conference': data.conferenceID })
                .populate({ path: 'messages', model: 'Message', match: { "seen": false }, populate: { path: 'author', model: 'User', match: { "role": "PARTICIPANT" } } })
                .exec(function (err, participations) {
                    if (err) {
                        validation.addError("Účasti se nepodařilo získat");
                        callback(validation);
                        return;
                    }

                    // user obtained
                    validation.data = participations;
                    callback(validation);
                    return;
                });
        }

        else {
            callback(validation);
            return;
        }

    },
    // remove
    remove: function (participation, callback) {
        var validation = new ValidationResult({});

        if (!participation._id) {
            validation.addError("Účast se nezdařilo nalézt v databázi");
            callback(validation);
            return;
        }

        ParticipationModel.find({ _id: participation._id })
            .remove()
            .exec(function (err) {
                // user remove error
                if (err) {
                    validation.addError("Účast se nezdařilo odebrat");
                    callback(validation);
                    return;
                }
            });
        // conference update
        ConferenceModel.update(
            { _id: participation.conference },
            { $pull: { participations: participation._id } },
            { safe: true },
            function (err) {
                if (err) {
                    validation.addError("Účast se nezdařilo odebrat z konference");
                    callback(validation);
                    return;
                }
            });
        // user update
        UserModel.update(
            { _id: participation.user },
            { $pull: { participations: participation._id } },
            { safe: true },
            function (err) {
                if (err) {
                    validation.addError("Účast se nezdařilo odebrat od uživatele");
                    callback(validation);
                    return;
                }
            });
        // messages remove
        MessageModel.remove({ participation: participation._id }, function (err) {
            if (err) {
                validation.addError("Zprávy dané účasti se nezdařilo odebrat");
                callback(validation);
                return;
            }
        })

        callback(validation);
        return;

    },

    // participation structure validation
    validate: function (participation) {
        // validation init
        validation = new ValidationResult(participation);

        if (validation.data.attendees) {
            validation.data.attendees.forEach(function (attendee, index) {
                if (!attendee.name) {
                    validation.addError("Jméno účastnika " + (index + 1) + " je povinné");
                }
            });
        }

        validation.checkIfIsDefinedAndNotEmpty('state', "Stav účasti je povinný");
        validation.checkIfIsDefinedAndNotEmpty('conference', "Vyběr konference, kde proběhne účast je povinná");

        return validation;
    }
}