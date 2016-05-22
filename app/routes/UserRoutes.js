/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce)
*/

module.exports = function (app) {

    var UserService = require('./../services/UserService');

    // get all unvited to action
    app.post('/api/user/uninvited/:conferenceID', function (req, res) {
        UserService.getUninvited(req.params.conferenceID, function (validation) {
            res.json(validation);
        });
    });


    // save
    app.post('/api/user', function (req, res) {
        UserService.save(req.body, function (validation) {
            res.json(validation);
        });
    });

    // get all users
    app.get('/api/user/getAll/:filter', function (req, res) {
        UserService.getList(req.params.filter, function (validation) {
            res.json(validation);
        });
    });

    // get user by ID
    app.post('/api/user/:user_id', function (req, res) {
        UserService.get({
            _id: req.params.user_id
        },
            function (validation) {
                res.json(validation);
            });
    });


    // delete user by ID and get back all users
    app.delete('/api/user/:user_id', function (req, res) {
        UserService.remove({
            _id: req.params.user_id
        }, function (validation) {
            res.json(validation);
        });
    });
};