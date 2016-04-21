angular.module('IssueSrvc', []).factory('IssueService',["$http", function ($http){
    return {
        save: function (issue) {
            return $http.post("/api/issue", issue);
        },
        getAll: function () {
            return $http.get("/api/issue");
        }          
    }    
}]);