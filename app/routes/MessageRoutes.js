module.exports = function(app) {

    var MessageService = require('./../services/MessageService');

    // save or create conference
    app.post('/api/message', function(req, res) {
        MessageService.save(req.body, function(validation) {
            res.json(validation);
        });
    });
};