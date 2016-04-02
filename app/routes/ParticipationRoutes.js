module.exports = function(app) {

		var ParticipationService = require('./../services/ParticipationService');

        // save participation and send back all users after creation
        app.post('/api/participation', function(req, res) {
            console.log("here");
            ParticipationService.save(req.body, function(validation){
                res.json(validation);
            });    
        });
        
        app.get('/api/participation/:participantID', function(req, res) {
 			ParticipationService.getList(req.params.participantID, function(validation){
                res.json(validation);     
             });
        }); 

    };