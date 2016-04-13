angular.module('InvitationAnswersCtrl', []).controller('InvitationAnswersController', ['$scope', '$state', 'EmailService', function($scope, $state, EmailService) {



    EmailService.getAll()
        .success(function(data, status, headers, config) {
            if (data.isValid) {
                
            }
            else {
                $scope.showErrors(data.errors);
            }
        })
        .error(function(data, status) {
            console.error('Error', status, data);
        });

}]);