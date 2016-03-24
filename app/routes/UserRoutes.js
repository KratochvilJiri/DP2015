module.exports = function(app) {

		var UserService = require('./../services/UserService');

        // create user and send back all users after creation
        app.post('/api/user', function(req, res) {
            UserService.save(req.body, function(validation){
                res.json(validation);
            });    
        });
            

        // get all users
        app.get('/api/user', function(req, res) {
 			UserService.getList(function(validation){
                res.json(validation);     
             });
        });

        // delete user by ID and get back all users
        app.delete('/api/user/:user_id', function(req, res){
        	UserService.remove({
                _id: req.params.user_id
            }, function (validation){
               res.json(validation); 
            });
        });
    };