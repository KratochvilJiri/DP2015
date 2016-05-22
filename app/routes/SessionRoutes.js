/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

module.exports = function (app) {
    var User = require('./../models/UserModel');
    var Permissions = require('./../security/Permissions');

    // is session set?
    app.get('/api/session', function (req, res) {
        if (req.session.role) {
            res.json({ isValid: true, data: null, error: null });
        }
        else {
            res.json({ isValid: false, data: null, error: null });
        }
    });

    // update session 
    app.get('/api/session/update', function (req, res) {

        // if session is set - return role and name
        if (req.session.role) {
            res.json({
                isValid: true,
                data: {
                    name: req.session.name,
                    role: req.session.role,
                    _id: req.session._id,
                    permissions: req.session.permissions,
                    conferenceID: req.session.conferenceID
                },
                error: null
            });
        }
        // if session is not set - return null
        else {
            res.json({ isValid: false, data: null, error: null });
        }
    });
};