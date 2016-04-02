angular.module('MessageSrvc', []).factory('MessageService',["$http", function ($http){
    return {
        save: function (message) {
            return $http.post("/api/message", message);
        }          
    }    
}]);