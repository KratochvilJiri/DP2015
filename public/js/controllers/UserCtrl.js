angular.module('UserCtrl', []).controller('UserController', ['$scope', '$state', 'UserService', '$stateParams','SessionService', function($scope, $state, UserService, $stateParams, SessionService) {

    // define user for binding
    $scope.user = {};
    $scope.user.address = {};
    $scope.session = SessionService;
    $scope.settings = false;

    if($stateParams.userId == $scope.session.currentUser._id){
        $scope.settings = true;
    }

    // create new User
    $scope.save = function() {

        UserService.save($scope.user)
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.showSuccess("Uživatel byl úspěšně přidán/aktualizován.");
                    if ($scope.previousState == "participants") {
                        $state.go('home.participants');
                    }
                    else {
                        $state.go('home.administration.users');
                    }
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }

    if ($stateParams.userId) {
        UserService.get($stateParams.userId)
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.user = data.data;
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
        $scope.previousState = from.url;
    });


}]);