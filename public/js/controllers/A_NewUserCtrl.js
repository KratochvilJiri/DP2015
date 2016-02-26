angular.module('ANewUserCtrl',[]).controller('ANewUserController', ['$scope', 'UserService', function($scope, UserService){

	// define user for binding
	$scope.user = {};

	// clear form
	// $scope.formData = {};

	// create new User
	$scope.createUser = function () {
		UserService.create($scope.user)
		.success(function(data, status, headers, config){
			console.log(data);
		})
		.error(function(data, status){
			console.error('Error', status, data);
		});
	}
}]);