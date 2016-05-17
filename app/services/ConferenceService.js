var ConferenceModel = require('./../models/ConferenceModel');
var ValidationResult = require('./../models/ValidationResultsStructure');
var inbox = require("inbox");

module.exports = {

    // save or create conference
    save: function (req, conference, callback) {
        // conference validation
        var validation = this.validate(conference);

        if (!validation.isValid) {
            callback(validation);
            return;
        }

        var temp = conference.email.split("@");
        var imapServer = temp[1];
        // create connection
        var client = inbox.createConnection(conference.emailPort, ("imap." + imapServer), {
            secureConnection: true,
            auth: {
                user: conference.email,
                pass: conference.emailPassword
            }
        });
        // connect to client
        client.connect();

        client.on("connect", function () {
            // client.close();
            ConferenceModel.update({}, { active: false }, { multi: true }, function (err, conferences) {
                if (err) {
                    validation.addError("Nepodařila se nastavit neaktivita konferencí");
                    callback(validation);
                    return;
                }
                else {
                    //  conference already exists
                    if (conference._id) {

                        ConferenceModel.findById(conference._id, function (err, dbConference) {
                            // error check
                            if (err) {
                                validation.addError("Konferenci se nezdařilo nalézt v databázi");
                                callback(validation);
                                return;
                            }
                            req.session.conferenceID = conference._id;
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
                            dbConference.save(function (err) {
                                if (err) {
                                    validation.addError("Konferenci se nezdařilo uložit");
                                    callback(validation);
                                    return;
                                }
                                client.close();
                            });
                        })
                    }
                    else {
                        ConferenceModel.create(conference, function (err, dbConference) {
                            // conference creation error
                            if (err) {
                                validation.addError(err);
                                validation.addError("Nepodařilo se vytvořit konferenci");
                                callback(validation);
                                return;
                            }
                            req.session.conferenceID = dbConference._id;
                            // conference created
                            client.close();
                        });
                    }
                }
            });
        });

        client.on('close', function () {
            callback(validation);
            return;
        });

        // wrong credentials
        client.on("error", function (err) {
            if (err.errorType == "TimeoutError") {
                validation.addError("Zadané přihlašovací údaje k emailu nejsou správné.");
            }
        });
    },

    // conference structure validation
    validate: function (conference) {
        // validation init
        validation = new ValidationResult(conference);

        // check required values
        validation.checkIfIsDefinedAndNotEmpty('date', "Datum začátku konference je povinné");
        validation.checkIfIsDefinedAndNotEmpty('name', "Název konference je povinný");
        validation.checkIfIsDefinedAndNotEmpty('email', "Email konference je povinný");
        validation.checkIfIsDefinedAndNotEmpty('emailPassword', "Heslo k emailu konference je povinný");
        validation.checkIfIsDefinedAndNotEmpty('emailPort', "Port k emailu konference je povinný");
        validation.checkIfIsDefinedAndNotEmpty('notification', "Upozornění na odevzdání příloh je povinné")

        if (validation.data.attachementTypes) {
            validation.data.attachementTypes.forEach(function (attachementType) {
                if (!attachementType.name) {
                    validation.addError("Název typu přílohy je povinný");
                }
                else if (!attachementType.date) {
                    validation.addError("Datum odevzdání přílohy je povinné");
                }
            });
        }

        if (validation.data.sponsorshipLevels) {
            validation.data.sponsorshipLevels.forEach(function (sponsorshipLevel) {
                if (!sponsorshipLevel.name) {
                    validation.addError("Název úrovně sponzorství je povinné");
                }
            });
        }
        return validation;
    },

    // deactive all other conferences
    deactivateAll: function (validation, callback) {
        ConferenceModel.update({}, { active: false }, { multi: true }, function (err, conferences) {
            if (err) {
                validation.addError("Nepodařila se nastavit neaktivita konferencí");
                callback(validation);
                return;
            }
            else {
                callback(validation);
                return;
            }
        });
    },

    // get all conference
    getList: function (callback) {
        var validation = new ValidationResult([]);

        // find all conference
        ConferenceModel.find({}, 'name date notification active sponsorshipLevels attachementTypes place attendeesNumber invitation email emailPassword emailPort participations', function (err, allConference) {
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
    getFilteredList: function (conferenceIDs, callback) {
        var validation = new ValidationResult([]);

        // find all conference
        ConferenceModel.find({ "_id": { $nin: conferenceIDs } }, function (err, conference) {
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
    },

    // get conference by ID
    get: function (conference, callback) {
        var validation = new ValidationResult({});

        if (conference.filter == "PARTICIPANTS") {
            ConferenceModel.findById(conference._id, "name date place sponsorshipLevels participations")
                .populate({
                    path: 'participations', model: 'Participation', select: "state sponsorshipLevel"
                })
                .exec(function (err, conferenceDB) {
                    if (err) {
                        validation.addError(err);
                        callback(validation);
                        return;
                    }
                    else {
                        validation.data = conferenceDB;
                        callback(validation);
                        return;
                    }
                });
        }

        else {
            ConferenceModel.findById(conference._id, "invitation", function (err, conferenceDB) {
                if (err) {
                    validation.addError(err);
                    callback(validation);
                    return;
                }
                else {
                    validation.data = conferenceDB;
                    callback(validation);
                    return;
                }
            });
        }
    },

    // get last 5 conference
    getLast5: function (callback) {
        var validation = new ValidationResult({});

        ConferenceModel.find({ "active": false }, 'name date')
            .limit(5)
            .sort('-date')
            .exec(function (err, allConference) {
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

    // get conferences - names
    getListNames: function (callback) {
        var validation = new ValidationResult([]);

        // find all conference
        ConferenceModel.find({}, 'name sponsorshipLevels', function (err, allConference) {
            // get all conference error
            if (err) {
                validation.addError("Nepodařilo se získat seznam konferencí.");
                callback(validation);
                return;
            }
            // all conference obtained
            validation.data = allConference;

            callback(validation);
            return;
        });
    },

    // remove conference by ID
    remove: function (req, conference, callback) {
        var validation = new ValidationResult(conference);

        // _id is needed for remove
        if (!conference._id) {
            validation.addError("Konferenci nelze smazat bez identifikátoru");
            callback(validation);
            return;
        }

        ConferenceModel.remove(conference, function (err, dbUser) {
            // conference remove error
            if (err) {
                validation.addError("Konferenci se nezdařilo odebrat");
                callback(validation);
                return;
            }
        });

        ConferenceModel.findOne({ "$query": { active: false }, "$orderby": { "date": -1 } }, function (err, conferenceDB) {
            if (err) {
                validation.addError("Konferenci se nezdařilo získat" + err);
                callback(validation);
                return;
            }
            req.session.conferenceID = conferenceDB._id;

            conferenceDB.active = true;
            conferenceDB.save(function (err) {
                if (err) {
                    validation.addError("Konferenci se nezdařilo uložit");
                    callback(validation);
                    return;
                }

                //validation.data = dbConference._id;
                callback(validation);
                return;
            });

        });
    },

    getActive: function (session, callback) {
        // nothing
    }

}