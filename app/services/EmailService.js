var ConferenceModel = require('./../models/ConferenceModel');
var ValidationResult = require('./../models/ValidationResultsStructure');

var Imap = require('imap');
var inspect = require('util').inspect;
var fs = require('fs'), fileStream;
var MailListener = require("mail-listener2");
var htmlToText = require('html-to-text');
var inbox = require("inbox");
var MailParser = require("mailparser").MailParser;

module.exports = {


    getAll: function(callback) {

        var validation = new ValidationResult([]);
        var chunks = [];
        var chunklength = 0;
        var messageStream;

        // create connection
        var client = inbox.createConnection(993, "imap.gmail.com", {
            secureConnection: true,
            auth: {
                user: "excelfit16@gmail.com",
                pass: "123jahod"
            }
        });
        // connect to client
        client.connect();

        var xy;



        function parseEmail(email) {
            return new Promise(function(resolve, reject) {
                var mailparser = new MailParser();
                delete messageStream;
                console.log(email.UID);

                client.fetchData(email.UID, function(error, messageData) {

                    console.log(messageData.flags);
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

                        chunks = [];
                        chunklength = 0;

                        // send the email source to the parser
                        //console.log(emailStr);
                        mailparser.end(emailStr);
                    });

                });

                mailparser.on("end", function(mail_object) {
                    //console.log("From:", mail_object.from); //[{address:'sender@example.com',name:'Sender Name'}]
                    //console.log(mail_object.from);
                    resolve(mail_object);
                });


                // if error
                //reject("Error");
            });
        }


        function parseEmails(emails) {
            var index = 0;

            function next() {
                if (index < emails.length) {
                    
                    parseEmail(emails[index]).then(function(parsedEmail) {
                        //console.log(parsedEmail);
                        // do something with parsed email
                        console.log(parsedEmail.flags);
                        index++;
                        next();
                    })
                }
            }
            next();

            //return emails;
        }


        // if connected
        client.on("connect", function() {
            // open INBOX
            client.openMailbox("INBOX", function(error, info) {

                if (error) {
                    validation.addError(error);
                    callback(validation);
                    return;
                }

                client.listFlags(-20, function(err, messages) {
                    //console.log(messages);
                    var emails = parseEmails(messages);
                });


                // get last 20 emails
                /*  client.listFlags(-20, function(err, messages) {
                      // for every email
                      messages.forEach(function(message) {
                          // fetch data
                          client.fetchData(message.UID, function(error, messageData) {
                              console.log(message.UID + "asdasd" + messageData.UID);
                              console.log("-----------------fu");
  
                              // fetch whole message (because of body/text)
                              messageStream = client.createMessageStream(messageData.UID);
  
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
                                  var email = body.toString();
  
                                  chunks = [];
                                  chunklength = 0;
  
                                  // send the email source to the parser
                                  var text = mailparser.end(email);
                              });
                          });
                      });
                  }); */

            });

        });

        //client.close();
        client.on('close', function() {
            console.log('DISCONNECTED!');
        });


    },

    // create user
    /*
    getAll: function(callback) {

        var validation = new ValidationResult([]);
        
        
        findUnseen()
        

        var mailListener = new MailListener({
            username: "excelfit16@gmail.com",
            password: "123jahod",
            host: "imap.gmail.com",
            port: 993, // imap port 
            tls: true,
            tlsOptions: { rejectUnauthorized: false },
            mailbox: "INBOX", // mailbox to monitor 
            searchFilter: [['SINCE', 'May 20, 2010'] ], // the search filter being used after an IDLE notification has been retrieved 
            markSeen: true, // all fetched email willbe marked as seen and not fetched next time 
            fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`, 
        });


        mailListener.start(); // start listening 

        // stop listening 
        //mailListener.stop(); 

        mailListener.on("server:connected", function() {
            // probably nothing to do
        });

        // stop listening and return emails
        mailListener.on("server:disconnected", function() {
            callback(validation);
            return;
        });

        mailListener.on("error", function(err) {
            console.log("err:" + err);
        });

        // define variable
        var stopWatch;
        var temp = {};
        temp.sender = {};
        var counter = 0;


        mailListener.on("mail", function(mail, seqno, attributes) {
            console.log(attributes);
            // reset stopWatch           
            clearInterval(stopWatch);
            counter++;

            // remove html elements from email content
            var content = htmlToText.fromString(mail.html, {
                wordwrap: false
            });

            // create email - temp
            temp.content = content;
            temp.date = mail.date;
            temp.sender.email = mail.from[0].address;
            temp.sender.name = mail.from[0].name;

            // add email to data if is not over limit
            if (counter < 20) {
                validation.data.push(temp);
            }
            else{
                stopListening();
            }

            // start stopWatch
            stopWatch = setInterval(stopListening, 600);

        });

        // time is over and properly in mailbox arent any other emails
        function stopListening() {
            console.log("fucker");
            // stop stopWatch
            clearInterval(stopWatch);
            // stop listening
            mailListener.stop();
        }



    },*/

    // user structure validation
    validate: function(message) {
        // validation init
        validation = new ValidationResult(message);
        return validation;
    }
}