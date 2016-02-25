angular.module('AUsersCtrl',[]).controller('AUsersController',['$scope', 'UserService', function($scope, UserService){

	console.log("ready");

	 UserService.getAll()
 	.success(function(data,status,headers,config){
 		console.log("wtf");
 		console.log(data.data[0].email);
 		$scope.users = data.data;
 	})
 	.error(function(data, status){
 		console.error('Repos error', status, data);
 	});


 	$scope.removeUser = function(userID){
 		console.log("I wanna remove:" + userID);
 		UserService.delete(userID)
 		.success(function(data){
 			$scope.users = data.data;
 		});
 	}

}]);