/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

module.exports = function (app) {

    var MessageService = require('./../services/MessageService');

    // save message
    app.post('/api/message', function (req, res) {
        MessageService.save(req.body, function (validation) {
            res.json(validation);
        });
    });
};