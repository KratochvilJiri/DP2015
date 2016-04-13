angular.module('InvitationAnswersCtrl', []).controller('InvitationAnswersController', ['$scope', '$state', 'EmailService', function($scope, $state, EmailService) {

    $scope.emails = [];
    $scope.loader = true;

    $scope.isActive = function(viewLocation) {
        return $scope.loader;
    };

    EmailService.getAll()
        .success(function(data, status, headers, config) {
            if (data.isValid) {
                $scope.emails = data.data;
                $scope.loader = false;
            }
            else {
                $scope.showErrors(data.errors);
            }
        })
        .error(function(data, status) {
            console.error('Error', status, data);
        });

}]);