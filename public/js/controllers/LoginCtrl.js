angular.module('LoginCtrl', []).controller('LoginController', ['$scope', '$state', 'AuthorizationService', function($scope, $state, AuthorizationService) {

    $scope.user = {};

    // user authorization by email and password
    $scope.authorize = function(params) {
        AuthorizationService.authorize($scope.user)
            .success(function(data) {
                if (data.isValid) {
                    $state.go('home.dashboard');
                }
                else {
                    // to do - error function
                    console.log("wrong pass/login - to do - print error function");
                }
            });
    }

}]);