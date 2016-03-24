module.exports = function (app) {
    var User = require('./../models/UserModel');
    var Permissions = require('./../security/Permissions');
    
    
    
    app.post("/api/authorization/authorize", function (req, res) {
        User.findOne({ 'email': req.body.email }, function (err, user) {
            if (err){
              //throw err;
              res.json({isValid: false, data: null, error: err }); 
            } 
            
            // user not found
            if(!user){
                res.json({isValid: false, data: null, error: ["user not found"] });
            }
            else if(user){
                // check if password matches
                if(user.password != req.body.password){
                    res.json({isValid: false, data: null, error: ["wrong password"]});
                }
                // user found and password is right
                else{
                    req.session.name = user.name;
                    req.session.role = user.role;
                    req.session.permissions = Permissions[req.session.role];
                    res.json({isValid: true, data: null, error: null});
                    
                }    
            }
        });     
    });

    // deauthorization - set session to null
    app.get("/api/authorization/deauthorize", function (req, res) {
        req.session.name = null;
        req.session.role = null;
        req.session.permissions = null;
        res.json({isValid: true, data: null, error: null});
    });
}