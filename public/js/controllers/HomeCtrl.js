/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

angular.module('HomeCtrl', []).controller('HomeController', ['$scope', 'SessionService', 'AuthorizationService', '$rootScope', function ($scope, SessionService, AuthorizationService, $rootScope) {
    // active menu structure
    $rootScope.menu = {
        dashboard: false,
        actionAdministration: false,
        helpdesk: false,
        participants: false,
        administration: false,
        profile: false
    }
    // initialization  
    $scope.errors = [];
    $scope.session = SessionService;
    // deauthorize user
    $scope.deauthorize = function () {
        AuthorizationService.deauthorize()
            .success(function (data) {
                SessionService.removeCurrentUser()
            })
            .error(function (data, status) {
                console.error('Error', status, data.error);
            });
    }
    
    $scope.isActive = function (viewLocation) {
        return $rootScope.loader;
    };

    // showing errors
    $scope.showErrors = function (errors) {
        $scope.errors = errors;
        $('html,body').animate({ scrollTop: 0 }, 'slow');
        $('.message.status-alert').fadeIn();
    }

    // showing success operation
    $scope.showSuccess = function (message) {
        $scope.message = message;
        $('html,body').animate({ scrollTop: 0 }, 'slow');
        $('.message.status-success').fadeIn().delay(2000).fadeOut();
    }

}]);