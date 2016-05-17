module.exports = function (app) {

    var ParticipationService = require('./../services/ParticipationService');

    // save 
    app.post('/api/participation', function (req, res) {
        ParticipationService.save(req.body, function (validation) {
            res.json(validation);
        });
    });
    // get all
    app.get('/api/participation/:participantID', function (req, res) {
        ParticipationService.getList(req.params.participantID, function (validation) {
            res.json(validation);
        });
    });
    // get unseen messages - admin/contact person
    app.post('/api/participation/conferenceUnseenMessages', function (req, res) {
        ParticipationService.getUnseenMessages(req.body, function (validation) {
            res.json(validation);
        });
    });
    // get participation by conference ID
    app.post('/api/participation/conference/:conferenceID', function (req, res) {
        ParticipationService.getListByConference(req.params.conferenceID, function (validation) {
            res.json(validation);
        });
    });
    // delete participation
    app.post('/api/participation/delete', function (req, res) {
        ParticipationService.remove(req.body, function (validation) {
            res.json(validation);
        });
    });

};