angular.module("EmailSrvc", []).factory("EmailService", ["$http", function($http){

	return{
		getAll: function(){
			return $http.post("/api/email");
		},
        markAsSeen: function(emailID){
			return $http.post("/api/email/mark/"  + emailID);
		},
        remove: function(emailID){
			return $http.post("/api/email/remove/"  + emailID);
		}
	}

}]);