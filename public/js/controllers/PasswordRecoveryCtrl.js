/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

angular.module('PasswordRecoveryCtrl', []).controller('PasswordRecoveryController', ['$scope', 'EmailService', function ($scope, EmailService) {

    $scope.user = {};
    $scope.user.email = "";
    $scope.recoveryPassword = function () {
        EmailService.recoveryPassword($scope.user)
            .success(function (data) {
                if (data.isValid) {
                    $scope.showSuccess("Bylo Vám zasláno heslo na zadaný email.")
                }
                else {
                    $scope.showErrors(data.errors);
                }

            })
            .error(function (data, status) {
                console.error('Error', status, data);
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