module.exports = function (app) {
    var User = require('./../models/UserModel');
    
    
    
    app.post("/api/authorization/authorize", function (req, res) {
        User.findOne({ 'email': req.body.email }, function (err, user) {
            if (err){
              throw err;
              res.json({isValid: false, data: null, error: err }); 
            } 
            
            // user not found
            if(!user){
                res.json({isValid: true, data: "user not found", error: null });
            }
            else if(user){
                // check if password matches
                if(user.password != req.body.password){
                    res.json({isValid: true, data: "wrong password", error: null});
                }
                // user found and password is right
                else{
                    req.session.name = user.name;
                    req.session.role = user.role;
                    res.json({isValid: true, data: true, error: null});
                    
                }    
            }
        });     
    });

    app.get("/api/authorization/deauthorize", function (req, res) {
        res.session.name = null;
        res.session.role = null;
        res.json({isValid: true, data: null, error: null});
    });
}