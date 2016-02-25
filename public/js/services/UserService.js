angular.module("UserSrvc", []).factory("UserService", ["$http", function($http){

	return{
		create: function(user){
			return $http.post("/api/user", user);
		},

		getAll: function(){
			console.log("getAll");
			return $http.get("/api/user");
		},

		delete: function(userID){
			return $http.delete("/api/user/" + userID);
		}
	}

}]);