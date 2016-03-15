angular.module('AuthorizationSrvc', []).factory('AuthorizationService', ['$http', function ($http) {
    return {
        authorize: function (user) {
            return $http.post("/api/authorization/authorize", user);
        },
        deauthorize: function () {
            return $http.get("/api/authorization/deauthorize");
        }
    }
}]);