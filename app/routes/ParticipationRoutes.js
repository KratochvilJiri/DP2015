module.exports = function(app) {

    var ParticipationService = require('./../services/ParticipationService');

    // save participation and send back all users after creation
    app.post('/api/participation', function(req, res) {
        ParticipationService.save(req.body, function(validation) {
            res.json(validation);
        });
    });

    app.get('/api/participation/:participantID', function(req, res) {
        ParticipationService.getList(req.params.participantID, function(validation) {
            res.json(validation);
        });
    });
    
    app.post('/api/participation/conferenceUnseenMessages', function(req, res) {
        ParticipationService.getUnseenMessages(req.body, function(validation) {
            res.json(validation);
        });
    });

    app.post('/api/participation/conference/:conferenceID', function(req, res) {
        ParticipationService.getListByConference(req.params.conferenceID, function(validation) {
            res.json(validation);
        });
    });

};