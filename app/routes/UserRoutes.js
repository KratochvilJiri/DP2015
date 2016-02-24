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
 			res.send("wtf");
        });



        	//res.send(req.body);

        // frontend routes =========================================================
        // route to handle all angular requests
        //app.get('*', function(req, res) {
          //  res.sendfile('./public/views/index.html'); // load our public/index.html file
        //});

    };