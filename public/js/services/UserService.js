angular.module("UserSrvc", []).factory("UserService", ["$http", function($http){

	return{
		save: function(user){
			return $http.post("/api/user", user);
		},

		getAll: function(filter){
			return $http.get("/api/user/getAll/" + filter);
		},
        
        get: function(userID){
            return $http.post("/api/user/" + userID);    
        },

		delete: function(userID){
			return $http.delete("/api/user/" + userID);
		}
	}

}]);