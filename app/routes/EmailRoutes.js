module.exports = function(app) {

    var EmailService = require('./../services/EmailService');

    // save or create conference
    app.post('/api/email', function(req, res) {
        EmailService.getAll(function(validation) {
            res.json(validation);
        });
    });
};