angular.module("EmailSrvc", []).factory("EmailService", ["$http", function($http){

	return{
		getAll: function(){
			return $http.post("/api/email");
		}
	}

}]);