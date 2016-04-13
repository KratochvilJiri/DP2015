var ConferenceModel = require('./../models/ConferenceModel');
var ValidationResult = require('./../models/ValidationResultsStructure');

var inbox = require("inbox");
var MailParser = require("mailparser").MailParser;

module.exports = {

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
                                        content: parsedEmail.text
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

    // user structure validation
    validate: function(message) {
        // validation init
        validation = new ValidationResult(message);
        return validation;
    }
}