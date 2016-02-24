angular.module('ANewUserCtrl',[]).controller('ANewUserController', ['$scope', 'UserService', function($scope, UserService){
 console.log("ready");

 $scope.user = {};

 UserService.getAll()
 	.success(function(data,status,headers,config){
 		$scope.users = data.result;
 	})
 	.error(function(data, status){
 		console.error('Repos error', status, data);
 	});

 $scope.createUser = function () {
 	UserService.create($scope.user)
 	.success(function(data, status, headers, config){
 		console.log(data);
 	});
 }

}]);