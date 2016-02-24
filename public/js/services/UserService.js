angular.module("UserSrvc", []).factory("UserService", ["$http", function($http){

	return{
		create: function(user){
			return $http.post("/api/user", user);
		}
	}

}]);