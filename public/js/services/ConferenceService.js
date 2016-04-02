angular.module('ConferenceSrvc', []).factory('ConferenceService',["$http", function ($http){
    return {
        getAll: function(){
            return $http.get("/api/conference");
        },
        
        getFilteredList: function (conferenceIDs) {
            return $http.post("/api/conference/getFilteredList", conferenceIDs);
        },
        
        save: function (conference) {
            return $http.post("/api/conference", conference);
        }           
    }    
}]);