angular.module("SessionSrvc", []).factory("SessionService", ["$http", function ($http) {
    
   
    var Session = {
        // currentUser 
        currentUser: null,
        
        isSet: function(){
            return $http.get("api/session");
        },
        
        updateCurrentUser: function() {
            console.log("service-updateCurrentUser");
            $http.get("/api/session/update")
                .success(function (data) {
                    return Session.currentUser = data.data;
                });
        },
        
        removeCurrentUser: function () {
            $http.get("/api/session/remove")
             .then(function (result) {
                 return Session.currentUser = result.data;
             })
        }
    };
    return Session;  
       

}]);