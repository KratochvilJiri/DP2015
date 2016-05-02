angular.module('UserCtrl', []).controller('UserController', ['$scope', '$state', 'UserService', '$stateParams', 'SessionService', '$rootScope', function ($scope, $state, UserService, $stateParams, SessionService, $rootScope) {
    // define user for binding
    $scope.user = {};
    $scope.user.address = {};
    $scope.session = SessionService;
    $scope.settings = false;

    if ($stateParams.userId == $scope.session.currentUser._id) {
        $scope.settings = true;
        $rootScope.menu = {
            dashboard: false,
            actionAdministration: false,
            helpdesk: false,
            participants: false,
            administration: false,
            profile: true
        }
    }
    else if ($scope.session.currentUser.role === "CONTACT_PERSON") {
        $rootScope.menu = {
            dashboard: false,
            actionAdministration: false,
            helpdesk: false,
            participants: true,
            administration: false,
            profile: false
        }
    }
    else {
        $rootScope.menu = {
            dashboard: false,
            actionAdministration: false,
            helpdesk: false,
            participants: false,
            administration: true,
            profile: false
        }
    }

    // create new User
    $scope.save = function () {

        UserService.save($scope.user)
            .success(function (data, status, headers, config) {
                if (data.isValid) {
                    $scope.showSuccess("Uživatel byl úspěšně přidán/aktualizován.");
                    if ($scope.previousState == "participants" && $scope.session.currentUser.role != "PARTICIPANT") {
                        $state.go('home.participants');
                    }
                    else if ($scope.session.currentUser.role != "PARTICIPANT") {
                        $state.go('home.administration.users');
                    }
                    else {
                        $state.go('home.dashboard');
                    }
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.error('Error', status, data);
            });
    }

    if ($stateParams.userId) {
        UserService.get($stateParams.userId)
            .success(function (data, status, headers, config) {
                if (data.isValid) {
                    $scope.user = data.data;
                    console.log($scope.user);
                    setTimeout(function () { $('.ui.dropdown').dropdown(); }, 500);
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.error('Error', status, data);
            });
    }


    //save the previous state
    $scope.$on('$stateChangeSuccess', function (event, to, toParams, from, fromParams) {
        $scope.previousState = from.url;
    });


}]);