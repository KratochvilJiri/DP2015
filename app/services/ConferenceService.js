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


        this.deactivateAll(validation, function(validation) {
            //  conference already exists
            if (conference._id) {
                ConferenceModel.findById(conference._id, function(err, dbConference) {
                    // error check
                    if (err) {
                        validation.addError("Konferenci se nezdařilo nalézt v databázi");
                        callback(validation);
                        return;
                    }

                    // Update and save conference
                    dbConference.name = conference.name;
                    dbConference.date = conference.date;
                    dbConference.notification = conference.notification;
                    dbConference.active = conference.active;
                    dbConference.invitation = conference.invitation;
                    dbConference.place = conference.place;
                    dbConference.email = conference.email;
                    dbConference.emailPassword = conference.emailPassword;
                    dbConference.emailPort = conference.emailPort;
                    dbConference.attendeesNumber = conference.attendeesNumber;
                    dbConference.sponsorshipLevels = conference.sponsorshipLevels;
                    dbConference.attachementTypes = conference.attachementTypes;


                    // Save conference
                    dbConference.save(function(err) {
                        if (err) {
                            validation.addError("Konferenci se nezdařilo uložit");
                            callback(validation);
                            return;
                        }

                        callback(validation);
                        return;
                    });
                })
            }
            else {
                ConferenceModel.create(conference, function(err, dbConference) {
                    // conference creation error
                    if (err) {
                        validation.addError(err);
                        validation.addError("Nepodařilo se vytvořit konferenci");
                        callback(validation);
                        return;
                    }
                    // conference created
                    callback(validation);
                    return
                });
            }
        });
    },

    // conference structure validation
    validate: function(conference) {
        // validation init
        validation = new ValidationResult(conference);

        // check required values
        validation.checkIfIsDefinedAndNotEmpty('date', "Datum začátku konference je povinné");
        validation.checkIfIsDefinedAndNotEmpty('name', "Název konference je povinný");
        validation.checkIfIsDefinedAndNotEmpty('email', "Email konference je povinný");
        validation.checkIfIsDefinedAndNotEmpty('emailPassword', "Heslo k emailu konference je povinný");
        validation.checkIfIsDefinedAndNotEmpty('emailPort', "Port k emailu konference je povinný");

        if (validation.data.attachementTypes) {
            validation.data.attachementTypes.forEach(function(attachementType) {
                if (!attachementType.name) {
                    validation.addError("Název typu přílohy je povinný");
                }
                else if (!attachementType.date) {
                    validation.addError("Datum odevzdání přílohy je povinné");
                }
            });
        }

        if (validation.data.sponsorshipLevels) {
            validation.data.sponsorshipLevels.forEach(function(sponsorshipLevel) {
                if (!sponsorshipLevel.name) {
                    validation.addError("Název úrovně sponzorství je povinné");
                }
            });
        }
        return validation;
    },

    deactivateAll: function(validation, callback) {
        ConferenceModel.update({}, { active: false }, { multi: true }, function(err, conferences) {
            if (err) {
                validation.addError("Nepodařila se nastavit neaktivita konferencí");
                callback(validation);
                return;
            }
            else {
                console.log("Neaktivni:", conferences);
                callback(validation);
                return;
            }
        });
    },

    // get all conference
    getList: function(callback) {
        var validation = new ValidationResult([]);

        // find all conference
        ConferenceModel.find({}, 'name date notification active sponsorshipLevels attachementTypes place attendeesNumber invitation email emailPassword emailPort', function(err, allConference) {
            // get all conference error
            if (err) {
                validation.addError("Nepodařilo se získat seznam konferencí (getList)");
                callback(validation);
                return;
            }
            // all conference obtained
            validation.data = allConference;

            callback(validation);
            return;
        });
    },

    // get conference, which arent in conferenceIDs collection 
    getFilteredList: function(conferenceIDs, callback) {
        var validation = new ValidationResult([]);

        // find all conference
        ConferenceModel.find({ "_id": { $nin: conferenceIDs } }, function(err, conference) {
            // erro check
            if (err) {
                validation.addError("Nepodařilo se získat upřesněný seznam konferencí (getFilteredList)");
                callback(validation);
                return;
            }
            //conference obtained
            validation.data = conference;

            callback(validation);
            return;
        });
    }
}