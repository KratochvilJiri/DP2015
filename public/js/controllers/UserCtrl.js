angular.module('UserCtrl',[]).controller('UserController', ['$scope', '$state', 'UserService', function($scope, $state, UserService){

	// define user for binding
	$scope.user = {};

	// clear form
	// $scope.formData = {};

	// create new User
	$scope.createUser = function () {
		
        UserService.create($scope.user)
		.success(function(data, status, headers, config){
			if(data.isValid){
                $state.go('home.administration.users');
            }
            else{
                // hlaska
            }
		})
		.error(function(data, status){
			console.error('Error', status, data);
		 });
	}
}]);