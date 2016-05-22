/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce)
*/

module.exports = function (app) {


    var AttachementService = require('./../services/AttachementService');

    // save attachement
    app.post('/api/attachement', function (req, res) {
        AttachementService.save(req.body, function (validation) {
            res.json(validation);
        });
    });

    // delete attachement
    app.post('/api/attachement/delete', function (req, res) {
        AttachementService.remove(req.body, function (validation) {
            res.json(validation);
        });
    });

    // check if exists
    app.post('/api/attachement/exists/:attachementTypeHash', function (req, res) {
        AttachementService.exists(req.params.attachementTypeHash, function (validation) {
            res.json(validation);
        });
    });
};