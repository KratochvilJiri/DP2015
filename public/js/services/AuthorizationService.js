/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce)
*/

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