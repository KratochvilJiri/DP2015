/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce)
*/
angular.module('IssueSrvc', []).factory('IssueService', ["$http", function ($http) {
    return {
        save: function (issue) {
            return $http.post("/api/issue", issue);
        },
        getAll: function () {
            return $http.get("/api/issue");
        },
        get: function (issueID) {
            return $http.post("/api/issue/" + issueID);
        },
        getUnsolvedCount: function () {
            return $http.get("/api/issue/unsolved");
        },
        getUnseenMessages: function (userRole) {
            return $http.post("/api/issue/unseen/" + userRole)
        }

    }
}]);