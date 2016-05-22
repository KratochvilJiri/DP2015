/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce)
*/

module.exports = function (app) {

    var EmailService = require('./../services/EmailService');

    // get all emails
    app.post('/api/email', function (req, res) {
        EmailService.getAll(function (validation) {
            res.json(validation);
        });
    });
    // get new emails count
    app.post('/api/email/newEmailsCount', function (req, res) {
        EmailService.getNewEmailsCount(function (validation) {
            res.json(validation);
        });
    });
    // mark email by ID
    app.post('/api/email/mark/:emailUID', function (req, res) {
        EmailService.mark(req.params.emailUID, function (validation) {
            res.json(validation);
        });
    });
    // remove email by ID
    app.post('/api/email/remove/:emailUID', function (req, res) {
        EmailService.remove(req.params.emailUID, function (validation) {
            res.json(validation);
        });
    });
    // send invitations
    app.post('/api/email/send', function (req, res) {
        EmailService.send(req.body, function (validation) {
            res.json(validation);
        });
    });
    // recovery pass - send email
    app.post('/api/email/recoveryPassword', function (req, res) {
        EmailService.recoveryPassword(req.body, function (validation) {
            res.json(validation);
        });
    });
};