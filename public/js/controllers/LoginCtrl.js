/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce)
*/
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
                    $scope.showErrors(["Nesprávný email nebo heslo."]);
                }
            });
    }
    
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