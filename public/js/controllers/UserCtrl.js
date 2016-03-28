angular.module('UserCtrl', []).controller('UserController', ['$scope', '$state', 'UserService', function($scope, $state, UserService) {

    // define user for binding
    $scope.user = {};

    // clear form
    // $scope.formData = {};

    // create new User
    $scope.createUser = function() {

        UserService.create($scope.user)
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    console.log($scope.previousState);
                    if($scope.previousState == "participants")
                        $state.go('home.participants');
                    else
                        $state.go('home.administration.users');
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }

    //save the previous state
    $scope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
        console.log(from.url);
        $scope.previousState = from.url;
    });


}]);