/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

angular.module('ConferenceSrvc', []).factory('ConferenceService', ["$http", function ($http) {
    return {
        getAll: function () {
            return $http.get("/api/conference");
        },

        getListNames: function () {
            return $http.get("/api/conference/names");
        },

        getFilteredList: function (conferenceIDs) {
            return $http.post("/api/conference/getFilteredList", conferenceIDs);
        },

        getLast5: function () {
            return $http.post("/api/conference/getLast5");
        },

        save: function (conference) {
            return $http.post("/api/conference", conference);
        },

        get: function (conference) {
            return $http.post("/api/conference/get", conference);
        },

        delete: function (conferenceID) {
            return $http.delete("/api/conference/" + conferenceID);
        }
    }
}]);