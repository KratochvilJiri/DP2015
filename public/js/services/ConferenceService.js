angular.module('ConferenceSrvc', []).factory('ConferenceService',["$http", function ($http){
    return {
        getAll: function(){
            $http.get("/api/conference");
        },
        
        save: function (conference) {
            $http.post("/api/conference", conference);
        }           
    }    
}]);