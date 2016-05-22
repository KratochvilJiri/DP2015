/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

module.exports = function (app) {

    var ConferenceService = require('./../services/ConferenceService');

    // save or create conference
    app.post('/api/conference', function (req, res) {
        ConferenceService.save(req, req.body, function (validation) {
            res.json(validation);
        });
    });

    // get all filtered conference
    app.post('/api/conference/getFilteredList', function (req, res) {
        ConferenceService.getFilteredList(req.body, function (validation) {
            res.json(validation);
        });
    });
    // get all  conference
    app.get('/api/conference', function (req, res) {
        ConferenceService.getList(function (validation) {
            res.json(validation);
        });
    });
    // get all filtered conference
    app.get('/api/conference/names', function (req, res) {
        ConferenceService.getListNames(function (validation) {
            res.json(validation);
        });
    });
    // get all conference - only names
    app.get('/api/conference/active', function (req, res) {
        ConferenceService.getActive(req.session, function (validation) {
            res.json(validation);
        });
    })
    // get conference
    app.post('/api/conference/get', function (req, res) {
        ConferenceService.get(req.body, function (validation) {
            res.json(validation);
        });
    })
    // get last 5
    app.post("/api/conference/getLast5", function (req, res) {
        ConferenceService.getLast5(function (validation) {
            res.json(validation);
        });
    })
    // get remove
    app.delete('/api/conference/:conferenceID', function (req, res) {
        ConferenceService.remove(req, {
            _id: req.params.conferenceID
        }, function (validation) {
            res.json(validation);
        });
    });


};