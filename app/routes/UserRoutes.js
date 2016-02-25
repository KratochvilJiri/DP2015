module.exports = function(app) {

		var User = require('./../models/UserModel');

        // create nerd and send back all nerds after creation
        app.post('/api/user', function(req, res) {

        	User.create({
        		email: 'abc',
        		password: '123',
        		role: 'ADMINISTRATOR',
        		name: req.body.firstName,
        		phone: 'saasd'},
        		function(err,user){
        			if (err)
        				res.json({validation: "false", data: "null", error: err});
        			User.find(function(err,users){
        				if (err)
        					res.json({validation: "false", data: "null", error: err});
        				res.json({validation: "true", data: users, error: err});
        			});
        		});
        	});

        // create nerd and send back all nerds after creation
        app.get('/api/user', function(req, res) {
 			User.find(function(err,users){
        				if (err)
        					res.json({validation: "false", data: "null", error: err});
        				res.json({validation: "true", data: users, error: err});
        			});
        });

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