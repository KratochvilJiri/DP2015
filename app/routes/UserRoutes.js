module.exports = function(app) {

		var User = require('./../models/UserModel');

        // create user and send back all users after creation
        app.post('/api/user', function(req, res) {
    		// user create
        	User.create({
        		email: 'abc',
        		password: '123',
        		role: 'ADMINISTRATOR',
        		name: req.body.firstName,
        		phone: 'saasd'},
        		// user creation error
        		function(err,user){
        			if (err)
        				res.json({validation: "false", data: "null", error: err});
        			// user created - getAll users
        			User.find(function(err,users){
        				// getAll users error --> error response
        				if (err)
        					res.json({validation: "false", data: "null", error: err});
        				// getAll users - ok --> response
        				res.json({validation: "true", data: users, error: err});
        			});
        		});
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