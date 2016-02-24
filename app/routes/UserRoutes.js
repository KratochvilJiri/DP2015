module.exports = function(app) {

        // create nerd and send back all nerds after creation
        app.post('/api/user', function(req, res) {
        	console.log(req.originalUrl);
        	res.send(req.body);
        });

        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('*', function(req, res) {
            res.sendfile('./public/views/index.html'); // load our public/index.html file
        });

    };