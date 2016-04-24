angular.module('ConferenceSrvc', []).factory('ConferenceService', ["$http", function($http) {
    return {
        getAll: function() {
            return $http.get("/api/conference");
        },
        
        getListNames: function() {
            return $http.get("/api/conference/names");
        },

        getFilteredList: function(conferenceIDs) {
            return $http.post("/api/conference/getFilteredList", conferenceIDs);
        },
        
        getLast5: function () {
            return $http.post("/api/conference/getLast5");
        },

        save: function(conference) {
            return $http.post("/api/conference", conference);
        },

        get: function(conference) {
            return $http.post("/api/conference/get", conference);
        }
    }
}]);