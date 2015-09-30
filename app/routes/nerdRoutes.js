 // app/nerdRoutes.js
// server side

// grab the nerd model we just created
var Nerd = require('./../models/nerdModel');

    module.exports = function(app) {

        // server routes ===========================================================
        // handle things like api calls
        // authentication routes

        // sample api route
        app.get('/api/nerds', function(req, res) {

            // use mongoose to get all nerds in the database
            Nerd.find(function(err, nerds) {

                // if there is an error retrieving, send the error. 
                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);

                res.json(nerds); // return all nerds in JSON format
            });
        });

        // create nerd and send back all nerds after creation
        app.post('/api/nerds', function(req, res) {

            // create a nerd, information comes from AJAX request from Angular
            Nerd.create({
                name : req.body.text
            }, function(err, nerd) {
                if (err)
                    res.send(err);

                // get and return all the todos after you create another
                Nerd.find(function(err, nerds) {
                    if (err)
                        res.send(err)
                    res.json(nerds);
                });
            });
        });


        // delete a nerds
        app.delete('/api/nerds/:nerd_id', function(req, res) {
            Nerd.remove({
                _id : req.params.nerd_id
            }, function(err, nerd) {
                if (err)
                    res.send(err);

                // get and return all the todos after you create another
                Nerd.find(function(err, nerds) {
                    if (err)
                        res.send(err)
                    res.json(nerds);
                });
            });
        });

        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('*', function(req, res) {
            res.sendfile('./public/views/index.html'); // load our public/index.html file
        });

    };
