// server.js

// set up ========================
var express = require('express');
var session = require('express-session');
var app = express();                    // create our app w/ express
var mongoose = require('mongoose');          // mongoose for mongodb
var morgan = require('morgan');            // log requests to the console (express4)
var bodyParser = require('body-parser');       // pull information from HTML POST (express4)
var methodOverride = require('method-override');   // simulate DELETE and PUT (express4)
var path = require('path');


// configuration ===========================================

// config files
var db = require('./config/db');

// set our port
var port = process.env.PORT || 8080;

// connect to our mongoDB database 
// mongoose.connect(db.url);

mongoose.connect('mongodb://admin:juromil@ds054118.mongolab.com:54118/excel_fit', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected');
    }
});

// session initialization
app.use(session({ resave: true, saveUninitialized: true, secret: '1234strawberries', cookie: { maxAge: 6000000 } }));

// log every request to the console
app.use(morgan('dev'));
// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// routes ==================================================
require('./app/routes/UserRoutes')(app);
require('./app/routes/AuthorizationRoutes')(app);
require('./app/routes/SessionRoutes')(app);
require('./app/routes/ConferenceRoutes')(app);
require('./app/routes/ParticipationRoutes')(app);
require('./app/routes/MessageRoutes')(app);
require('./app/routes/AttachementRoutes')(app);
require('./app/routes/EmailRoutes')(app);
require('./app/routes/IssueRoutes')(app);
require('./app/routes/XRoutes')(app);

var CronService = require('./app/services/CronService');
CronService.start();

var UserService = require('./app/services/UserService');
UserService.init({});
// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);

// shoutout to the user                     
console.log('Magic happens on port ' + port);

// expose app           
exports = module.exports = app;   