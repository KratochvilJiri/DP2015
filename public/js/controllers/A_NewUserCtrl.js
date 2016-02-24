angular.module('ANewUserCtrl',[]).controller('ANewUserController', ['$scope', 'UserService', function($scope, UserService){
 console.log("ready");

 $scope.user = {};




 $scope.createUser = function () {
 	UserService.create($scope.user)
 	.success(function(data, status, headers, config){
 		console.log(data);
 	});
 }

}]);