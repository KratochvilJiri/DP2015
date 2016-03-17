module.exports = function(app) {

		var User = require('./../models/UserModel');

        // create user and send back all users after creation
        app.post('/api/user', function(req, res) {
    		// user create
            console.log(req.body);
        	User.create({
        		email: req.body.email,
        		password: "123",
        		role: req.body.role,
        		name: req.body.name,
        		phone: req.body.phone},
        		// user creation error
        		function(err,user){
        			if (err)
        				res.json({validation: false, data: null, error: err});

        		    res.json({validation: true, data: user, error: err});
        		});
        	});
            
        app.post('/api/user/auth', function(req,res) {
            res.json({validation: "false", data: "null", error: "nothing"});
        });

        // get all users
        app.get('/api/user', function(req, res) {
 			User.find(function(err,users){
        				if (err)
        					res.json({validation: "false", data: "null", error: err});
        				res.json({validation: "true", data: users, error: err});
        			});
        });

        // delete user by ID and get back all users
        app.delete('/api/user/:user_id', function(req, res){
        	User.remove({
        		_id : req.params.user_id
        	}, function(err, user){
        		if (err)
        			res.json({validation: "false", data: "null", error: err});
        		User.find(function(err, users){
        			if (err)
        				res.json({validation: "false", data: "null", error: err});
        			res.json({validation: "true", data: users, error: err});
        		});
        	});
        });
    };