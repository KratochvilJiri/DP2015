var ConferenceModel = require('./../models/ConferenceModel');
var ParticipationModel = require('./../models/ParticipationModel');
var UserModel = require('./../models/UserModel');
var ValidationResult = require('./../models/ValidationResultsStructure');

var nodemailer = require('nodemailer');
var inbox = require("inbox");
var MailParser = require("mailparser").MailParser;

module.exports = {

    remove: function(emailUID, callback) {
        var validation = new ValidationResult([]);

        ConferenceModel.findOne({ "active": true }, "email emailPort emailPassword", function(err, conferenceDB) {
            if (err) {
                validation.addError(err);
                callback(validation);
                return;
            }
            else {
                // get imap server
                var temp = conferenceDB.email.split("@");
                var imapServer = temp[1];


                // create connection
                var client = inbox.createConnection(conferenceDB.emailPort, ("imap." + imapServer), {
                    secureConnection: true,
                    auth: {
                        user: conferenceDB.email,
                        pass: conferenceDB.emailPassword
                    }
                });
                // connect to client
                client.connect();

                client.on("connect", function() {
                    // open INBOX
                    client.openMailbox("INBOX", function(error, info) {

                        // can not open INBOX
                        if (error) {
                            validation.addError(error);
                            callback(validation);
                            return;
                        }

                        // get last 20 email
                        client.deleteMessage(emailUID, function(err) {
                            if (err) {
                                validation.addError(err);
                                callback(validation);
                                return;
                            }
                            else {
                                client.close();
                                callback(validation);
                                return;
                            }
                        });
                    });
                });
            }
        })
    },

    mark: function(emailUID, callback) {
        var validation = new ValidationResult([]);

        ConferenceModel.findOne({ "active": true }, "email emailPort emailPassword", function(err, conferenceDB) {
            if (err) {
                validation.addError(err);
                callback(validation);
                return;
            }
            else {
                // get imap server
                var temp = conferenceDB.email.split("@");
                var imapServer = temp[1];


                // create connection
                var client = inbox.createConnection(conferenceDB.emailPort, ("imap." + imapServer), {
                    secureConnection: true,
                    auth: {
                        user: conferenceDB.email,
                        pass: conferenceDB.emailPassword
                    }
                });
                // connect to client
                client.connect();

                client.on("connect", function() {
                    // open INBOX
                    client.openMailbox("INBOX", function(error, info) {

                        // can not open INBOX
                        if (error) {
                            validation.addError(error);
                            callback(validation);
                            return;
                        }

                        // get last 20 email
                        client.addFlags(emailUID, ["\\Seen"], function(err, flags) {
                            if (err) {
                                validation.addError(err);
                                callback(validation);
                                return;
                            }
                            else {
                                client.close();
                                callback(validation);
                                return;
                            }
                        })
                    });
                });
            }
        })
    },

    getNewEmailsCount: function(callback) {
        var validation = new ValidationResult({});

        // get conference-email info
        ConferenceModel.findOne({ "active": true }, "email emailPort emailPassword", function(err, conferenceDB) {
            if (err) {
                validation.addError(err);
                callback(validation);
                return;
            }
            else {
                // get imap server
                var temp = conferenceDB.email.split("@");
                var imapServer = temp[1];


                // create connection
                var client = inbox.createConnection(conferenceDB.emailPort, ("imap." + imapServer), {
                    secureConnection: true,
                    auth: {
                        user: conferenceDB.email,
                        pass: conferenceDB.emailPassword
                    }
                });
                // connect to client
                client.connect();

                // if connected
                client.on("connect", function() {
                    // open INBOX
                    client.openMailbox("INBOX", function(error, info) {

                        // can not open INBOX
                        if (error) {
                            validation.addError(error);
                            callback(validation);
                            return;
                        }

                        var counter = 0;
                        // get last 20 email
                        client.listFlags(-20, function(err, messages) {
                            messages.forEach(function(message) {
                                if (!isSeen(message.flags)) {
                                    counter++;
                                }

                            });
                            validation.data.newEmailsCount = counter;
                            callback(validation);
                            return;
                        });
                    });

                });
            }
        })

        function isSeen(flags) {
            var seen = false;
            flags.forEach(function(flag) {
                //console.log(flag);
                if (flag === "\\Seen") {
                    seen = true;
                }
            });
            return seen;
        }

    },

    getAll: function(callback) {

        var validation = new ValidationResult([]);

        // get conference-email info
        ConferenceModel.findOne({ "active": true }, "email emailPort emailPassword", function(err, conferenceDB) {
            if (err) {
                validation.addError(err);
                callback(validation);
                return;
            }
            else {
                // get imap server
                var temp = conferenceDB.email.split("@");
                var imapServer = temp[1];


                // create connection
                var client = inbox.createConnection(conferenceDB.emailPort, ("imap." + imapServer), {
                    secureConnection: true,
                    auth: {
                        user: conferenceDB.email,
                        pass: conferenceDB.emailPassword
                    }
                });
                // connect to client
                client.connect();

                // parse one email-string to structure
                function parseEmail(email) {
                    return new Promise(function(resolve, reject) {
                        var mailparser = new MailParser();
                        var chunks = [];
                        var chunklength = 0;

                        // create messageStream
                        var messageStream = client.createMessageStream(email.UID);

                        // fetch a part of data
                        messageStream.on("data", function(chunk) {
                            // push chunk to chunks
                            chunks.push(chunk);
                            chunklength += chunk.length;
                        });

                        // all data fetched
                        messageStream.on("end", function() {
                            // concatenate to Buffer and convert to string
                            var body = Buffer.concat(chunks);
                            var emailStr = body.toString();

                            // send the email source to the parser
                            mailparser.end(emailStr);
                        });

                        mailparser.on("end", function(mail_object) {
                            resolve(mail_object);
                        });

                        // if error
                        //reject("Error");
                    });
                }


                function parseEmails(emails) {
                    var index = 0;

                    // parse next email
                    function next() {
                        if (index < emails.length) {
                            // fetch email data
                            client.fetchData(emails[index].UID, function(error, emailData) {
                                parseEmail(emailData).then(function(parsedEmail) {
                                    // email parser, create object for client
                                    var mailToSend = {
                                        from: parsedEmail.from,
                                        date: parsedEmail.date,
                                        subject: parsedEmail.subject,
                                        content: parsedEmail.text,
                                        flags: emailData.flags,
                                        UID: emailData.UID
                                    };
                                    // add email to validation data
                                    validation.data.push(mailToSend);
                                    // this email was the last --> callback
                                    if ((index + 1) == emails.length) {
                                        client.close();
                                        callback(validation);
                                        return;
                                    }

                                    index++;
                                    next();
                                })
                            });
                        }
                    }
                    next();
                }

                // if connected
                client.on("connect", function() {
                    // open INBOX
                    client.openMailbox("INBOX", function(error, info) {

                        // can not open INBOX
                        if (error) {
                            validation.addError(error);
                            callback(validation);
                            return;
                        }

                        // get last 20 email
                        client.listFlags(-20, function(err, messages) {
                            parseEmails(messages);
                        });
                    });

                });
            }
        })
    },

    send: function(email, callback) {
        console.log(email);
        var validation = this.validate(email);

        if (!validation.isValid) {
            callback(validation);
            return;
        }

        ConferenceModel.findOne({ "active": true }, "email emailPort emailPassword _id", function(err, dbConference) {
            if (err) {
                validation.addError(err);
                callback(validation);
                return;
            }
            else {

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

                var mailOptions = {
                    from: (dbConference.name + dbConference.email), // sender address
                    to: 'juurakratochvil@gmail.com', // list of receivers
                    subject: email.subject, // Subject line
                    text: email.text, // plaintext body
                    html: email.text // html body
                };



                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                        validation.addError(error);
                        callback(validation);
                        return;
                    }
                    else {
                        console.log('Message sent: ' + info.response);

                        // create new participations
                        email.addressees.forEach(function(addressee) {
                            var participation = {
                                user: addressee._id,
                                state: "INVITED",
                                conference: dbConference._id
                            }

                            // participation create
                            ParticipationModel.create(participation, function(err, dbParticipation) {
                                // participation creation error
                                if (err) {
                                    validation.addError("Nepodařilo se vytvořit účast po pozvání.");
                                    callback(validation);
                                    return;
                                }
                                else {
                                    // find addressee
                                    UserModel.findById(addressee._id, function(err, dbUser) {
                                        // error - find addressee
                                        if (err) {
                                            validation.addError("Nepodařilo se získat uživatele pro přidání účasti po pozvání.");
                                            callback(validation);
                                            return;
                                        }
                                        // addressee found
                                        else {
                                            // push participation to addressee
                                            console.log(dbParticipation._id);
                                            console.log(dbUser.name);
                                            dbUser.participations.push(dbParticipation._id);
                                            // save addressee
                                            dbUser.save(function(err) {
                                                // error check
                                                if (err) {
                                                    validation.addError("Nepodařilo se uložit uživatele po přidání účasti");
                                                    callback(validation);
                                                    return;
                                                }
                                                // addressee saved
                                                else {
                                                    // find conference
                                                    ConferenceModel.findOne({ "active": true }, "participations", function(err, dbConference) {
                                                        if (err) {
                                                            validation.addError(err);
                                                            callback(validation);
                                                            return;
                                                        }
                                                        // conference found
                                                        else {
                                                            // add participation to conference
                                                            dbConference.participations.push(dbParticipation._id);
                                                            console.log(dbParticipation._id);
                                                            console.log(dbConference.name);
                                                            // save conference
                                                            dbConference.save(function(err) {
                                                                // error check
                                                                if (err) {
                                                                    console.log(err);
                                                                    validation.addError("Nepodařilo se uložit konferenci po přidání účastníka");
                                                                    callback(validation);
                                                                    return;
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });

                        })
                        // all participations created
                        callback(validation);
                        return;
                    }
                });
            }
        });
    },

    // user structure validation
    validate: function(message) {
        // validation init
        validation = new ValidationResult(message);

        validation.checkIfIsDefinedAndNotEmpty('addressees', "Příjemci pozvánky jsou povinní");
        validation.checkIfIsDefinedAndNotEmpty('subject', "Předmět pozvánky je povinný");
        validation.checkIfIsDefinedAndNotEmpty('text', "Text pozvánky je povinný");

        return validation;
    }
}