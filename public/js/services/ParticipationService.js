/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

angular.module('ParticipationSrvc', []).factory('ParticipationService', ["$http", function ($http) {
    return {
        save: function (participation) {
            return $http.post("/api/participation", participation);
        },
        getList: function (participantID) {
            return $http.get("/api/participation/" + participantID);
        },
        getListByConference: function (conferenceID) {
            return $http.post("/api/participation/conference/" + conferenceID);
        },
        getUnseenMessages: function (data) {
            return $http.post("/api/participation/conferenceUnseenMessages", data);
        },
        delete: function (participation) {
            return $http.post("/api/participation/delete", participation);
        }

    }
}]);