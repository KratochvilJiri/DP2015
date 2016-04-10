module.exports = function(app) {


    var AttachementService = require('./../services/AttachementService');

    // create user and send back all users after creation
    app.post('/api/attachement', function(req, res) {
        console.log("save-routes");
        console.log(req.body);
        AttachementService.save(req.body, function(validation) {
            res.json(validation);
        });
    });

    // delete user by ID and get back all users
    app.post('/api/attachement/delete', function(req, res) {
        console.log(req.body);
        AttachementService.remove(req.body, function(validation) {
            res.json(validation);
        });
    });
};