angular.module("AttachementSrvc", []).factory("AttachementService", ["$http", function($http){

	return{
		save: function(attachement){
			return $http.post("/api/attachement", attachement);
		},

		remove: function(attachement){
            console.log("fucker v service");
            console.log(attachement);
			return $http.post("/api/attachement/delete", attachement);
		}
	}

}]);