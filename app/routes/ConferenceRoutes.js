module.exports = function(app) {

    var ConferenceService = require('./../services/ConferenceService');

    // save or create conference
    app.post('/api/conference', function(req, res) {
        ConferenceService.save(req.body, function(validation) {
            res.json(validation);
        });
    });

    // get all conference
    app.post('/api/conference/getFilteredList', function(req, res) {
        ConferenceService.getFilteredList(req.body, function(validation) {
            res.json(validation);
        });
    });

    app.get('/api/conference', function(req, res) {
        ConferenceService.getList(function(validation) {
            res.json(validation);
        });
    });
    
   app.get('/api/conference/names', function(req, res) {
        ConferenceService.getListNames(function(validation) {
            res.json(validation);
        });
    });

    app.post('/api/conference/get', function(req, res) {
        ConferenceService.get(req.body, function(validation) {
            res.json(validation);
        });
    })

    app.post("/api/conference/getLast5", function(req, res) {
        ConferenceService.getLast5(function(validation) {
            res.json(validation);
        });
    })


};