angular.module('ConferenceSrvc', []).factory('ConferenceService',["$http", function ($http){
    return {
        getAll: function(){
            return $http.get("/api/conference");
        },
        
        save: function (conference) {
            return $http.post("/api/conference", conference);
        }           
    }    
}]);