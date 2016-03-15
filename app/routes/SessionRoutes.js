module.exports = function (app) {
    var User = require('./../models/UserModel');

    //isSet
    app.get('/api/session', function (req, res) {
        if (req.session.role) {
             res.json({ isValid: true, data: true, error: null });
        }
        else {
            res.json({ isValid: true, data: false, error: null });
        }
    });

    // update
    app.get('/api/session/update', function (req, res) {
        
        console.log(req.session.role);
        if (req.session.role) {
            res.json({ isValid: true, data: {name: req.session.name,role: req.session.role}, error: null });
        }
        else {
            res.json({ isValid: true, data: false, error: null });
        }
    });

};