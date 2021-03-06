/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

angular.module('MessageSrvc', []).factory('MessageService', ["$http", function ($http) {
    return {
        save: function (message) {
            return $http.post("/api/message", message);
        }
    }
}]);