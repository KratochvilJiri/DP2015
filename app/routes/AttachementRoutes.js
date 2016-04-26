module.exports = function(app) {


    var AttachementService = require('./../services/AttachementService');

    // create user and send back all users after creation
    app.post('/api/attachement', function(req, res) {
        AttachementService.save(req.body, function(validation) {
            res.json(validation);
        });
    });

    // delete user by ID and get back all users
    app.post('/api/attachement/delete', function(req, res) {
        AttachementService.remove(req.body, function(validation) {
            res.json(validation);
        });
    });

    // delete user by ID and get back all users
    app.post('/api/attachement/exists/:attachementTypeHash', function(req, res) {
        AttachementService.exists(req.params.attachementTypeHash, function(validation) {
            res.json(validation);
        });
    });
};