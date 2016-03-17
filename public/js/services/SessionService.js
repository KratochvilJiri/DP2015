angular.module("SessionSrvc", []).factory("SessionService", ["$http", function($http) {


    var Session = {
        // currentUser 
        currentUser: null,

        // isSet user-session on server?
        isSet: function() {
            return $http.get("api/session");
        },

        // update frontend session form server-session
        updateCurrentUser: function() {
            console.log("service-updateCurrentUser");
            $http.get("/api/session/update")
                .success(function(data) {
                    return Session.currentUser = data.data;
                });
        },

        // remove frontend session
        removeCurrentUser: function() {
            return Session.currentUser = null;
        }
    };
    return Session;


}]);