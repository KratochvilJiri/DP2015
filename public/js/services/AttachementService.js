angular.module("AttachementSrvc", []).factory("AttachementService", ["$http", function($http){

	return{
		save: function(attachement){
			return $http.post("/api/attachement", attachement);
		},

		remove: function(attachement){
			return $http.post("/api/attachement/delete", attachement);
		},
        
        existsAttachementType: function (attachementTypeHash) {
            return $http.post("/api/attachement/exists/" + attachementTypeHash);
        }
	}

}]);