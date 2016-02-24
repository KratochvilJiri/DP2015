angular.module('AUsersCtrl',[]).controller('AUsersController',['$scope', 'UserService', function($scope, UserService){

	console.log("ready");

	 UserService.getAll()
 	.success(function(data,status,headers,config){
 		console.log("wtf");
 		console.log(data);
 		$scope.users = data;
 	})
 	.error(function(data, status){
 		console.error('Repos error', status, data);
 	});

}]);