module.exports = function (app) {

    var EmailService = require('./../services/EmailService');

    // save or create conference
    app.post('/api/email', function (req, res) {
        EmailService.getAll(function (validation) {
            res.json(validation);
        });
    });

    app.post('/api/email/newEmailsCount', function (req, res) {
        EmailService.getNewEmailsCount(function (validation) {
            res.json(validation);
        });
    });

    app.post('/api/email/mark/:emailUID', function (req, res) {
        EmailService.mark(req.params.emailUID, function (validation) {
            res.json(validation);
        });
    });

    app.post('/api/email/remove/:emailUID', function (req, res) {
        EmailService.remove(req.params.emailUID, function (validation) {
            res.json(validation);
        });
    });

    app.post('/api/email/send', function (req, res) {
        EmailService.send(req.body, function (validation) {
            res.json(validation);
        });
    });

    app.post('/api/email/recoveryPassword', function (req, res) {
        EmailService.recoveryPassword(req.body, function (validation) {
            res.json(validation);
        });
    });
};