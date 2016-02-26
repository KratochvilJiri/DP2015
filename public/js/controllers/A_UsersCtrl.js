angular.module('AUsersCtrl',[]).controller('AUsersController',['$scope', 'UserService', function($scope, UserService){

	// getAll users - every page-load
	UserService.getAll()
	.success(function(data,status,headers,config){
		console.log(data.data[0].email);
		$scope.users = data.data;	
	})
	.error(function(data, status){
		console.error('Error: ', status, data.error);
	});

 	// remove user by ID
 	$scope.removeUser = function(userID){
 		UserService.delete(userID)
 		.success(function(data){
 			$scope.users = data.data;
 		})
 		.error(function(data, status){
 			console.error('Error: ', status, data.error);
 		});
 	}
}]);