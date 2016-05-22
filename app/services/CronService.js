/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce)
*/

var ConferenceModel = require('./../models/ConferenceModel');
var ParticipationModel = require('./../models/ParticipationModel');
var UserModel = require('./../models/UserModel');
var cron = require('node-schedule');
var nodemailer = require('nodemailer');
var dateFormat = require('dateformat');

// controll unsubmitted attachements
module.exports = {
    start: function () {

        var transporter = undefined;

        var checkAttachements = function () {
            var today = new Date();
            transporter = undefined;
            today.setDate(today.getDate());

            var populateQuery = [{ path: 'user', model: 'User', select: "email" }, { path: 'attachements', model: 'Attachement', select: "hash" }];

            ConferenceModel.find({ date: { $gt: today } }, "name date participations attachementTypes notification email emailPassword")
                .populate({ path: 'participations', model: 'Participation', populate: populateQuery })
                .exec(function (err, conferenceDB) {
                    if (err) {
                        console.log(err);
                    }
                    conferenceDB.forEach(function (conference) {
                        conference.attachementTypes.forEach(function (type) {
                            // number of days remaining to deadline
                            var diff = Math.floor((type.date - today) / 86400000);
                            // notification is for today - send emails to those, who didnt upload attachement
                            if (diff == Number(conference.notification)) {
                                conference.participations.forEach(function (participation) {
                                    if (participation.sponsorshipLevel) {
                                        participation.sponsorshipLevel.type.attachementTypes.forEach(function (Ptype) {
                                            // the user should upload the attachement
                                            if (type.hash == Ptype.hash) {
                                                var uploaded = false;
                                                // is already uploaded?
                                                participation.attachements.forEach(function (attachement) {
                                                    if (attachement.hash == type.hash) {
                                                        uploaded = true;
                                                    }
                                                })
                                                // is not --> send notification
                                                if (!uploaded) {
                                                    if (!transporter) {
                                                        createConnection(conference.email, conference.emailPassword, function () {
                                                            sendEmail(conference.name, conference.email, participation.user.email, type.name, type.date);
                                                        });
                                                    }
                                                    else {
                                                        sendEmail(conference.name, conference.email, participation.user.email, type.name, type.date);
                                                    }
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    })
                });
        }

        var createConnection = function (email, password, callback) {
            var temp = email.split("@");
            var imapServer = temp[1];

            var smtpConfig = {
                host: ("smtp." + imapServer),
                port: 465,
                secure: true, // SSL
                auth: {
                    user: email,
                    pass: password
                }
            };
            transporter = nodemailer.createTransport(smtpConfig);
            callback();
        }

        var sendEmail = function (conferenceName, conferenceEmail, participantEmail, attachementType, attachementDate) {
            attachementDate = dateFormat(attachementDate, "yyyy-dd-mm'T'HH:MM:ss");
            var emailBody = "Dobrý den, <br /> neodvzdali jste přílohu: " + attachementType + "<br /> její odevzdání končí: " + attachementDate + ".<br /> Prosíme o co nejrychlejší odevzdání přílohy. <br /> <br />  Tato zpráva byla automaticky vygenerována systémem.";
            var mailOptions = {
                from: (conferenceName + conferenceEmail), // sender address
                to: participantEmail, // list of receivers
                subject: "Upozornění na odevzdání příloh", // Subject line
                text: emailBody, // plaintext body
                html: emailBody // html body
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                }
            });
        }

        var j = cron.scheduleJob('* * 23 * * *', function () {
            checkAttachements();
        });
    }

}
