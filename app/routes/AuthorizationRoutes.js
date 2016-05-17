module.exports = function (app) {
    var User = require('./../models/UserModel');
    var Permissions = require('./../security/Permissions');
    var ConferenceModel = require('./../models/ConferenceModel');


    // user authorization
    app.post("/api/authorization/authorize", function (req, res) {
        User.findOne({ 'email': req.body.email }, function (err, user) {
            if (err) {
                res.json({ isValid: false, data: null, error: err });
            }

            // user not found
            if (!user) {
                res.json({ isValid: false, data: null, error: ["user not found"] });
            }
            else if (user) {
                // check if password matches
                if (user.password != req.body.password) {
                    res.json({ isValid: false, data: null, error: ["wrong password"] });
                }
                // user found and password is right
                else {
                    req.session._id = user._id;
                    req.session.name = user.name;
                    req.session.role = user.role;
                    req.session.permissions = Permissions[req.session.role];

                    ConferenceModel.findOne({ "active": true }, "_id", function (err, conferenceDB) {
                        if (err) {
                            res.json({ isValid: false, data: null, error: err });
                        }
                        else {
                            if (conferenceDB) {
                                req.session.conferenceID = conferenceDB._id;
                            }
                            res.json({ isValid: true, data: null, error: null });
                        }
                    });
                }
            }
        });
    });

    // deauthorization - set session to null
    app.get("/api/authorization/deauthorize", function (req, res) {
        req.session._id = null;
        req.session.name = null;
        req.session.role = null;
        req.session.permissions = null;
        req.session.conferenceID = null;
        res.json({ isValid: true, data: null, error: null });
    });
}