angular.module("UserSrvc", []).factory("UserService", ["$http", function($http){

	return{
		create: function(user){
			return $http.post("/api/user", user);
		},

		getAll: function(filter){
			return $http.get("/api/user/" + filter);
		},

		delete: function(userID){
			return $http.delete("/api/user/" + userID);
		}
	}

}]);