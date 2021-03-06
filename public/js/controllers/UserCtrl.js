/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

angular.module('UserCtrl', []).controller('UserController', ['$scope', '$state', 'UserService', '$stateParams', 'SessionService', '$rootScope', function ($scope, $state, UserService, $stateParams, SessionService, $rootScope) {
    // initialization
    $scope.user = {};
    $scope.user.address = {};
    $scope.session = SessionService;
    $scope.settings = false;
    // active menu structure
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

    // save user
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
    // edit user --> load user detail
    if ($stateParams.userId) {
        UserService.get($stateParams.userId)
            .success(function (data, status, headers, config) {
                if (data.isValid) {
                    $scope.user = data.data;
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