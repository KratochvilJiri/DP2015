angular.module('UserCtrl', []).controller('UserController', ['$scope', '$state', 'UserService', function($scope, $state, UserService) {

    // define user for binding
    $scope.user = {};
    $scope.user.address = {};

    // clear form
    // $scope.formData = {};

    // create new User
    $scope.save = function() {

        UserService.save($scope.user)
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    if($scope.previousState == "participants")
                        $state.go('home.administration.participants');
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