angular.module('DashboardCtrl', []).controller('DashboardController', ['$scope', 'EmailService', 'ConferenceService', function($scope, EmailService, ConferenceService) {
    $scope.newEmails = 0;
    //$scope.loader.emails = false;


    EmailService.getNewEmailsCount()
        .success(function(data) {
            if (data.isValid) {
                $scope.newEmails = data.data.newEmailsCount;
            }
            else {
                $scope.showErrors(data.errors);
            }
        })
        .error(function(data, status) {
            console.log('Error: ', status, data.error);
        });

    $scope.Loaded = function() {
        if ($loader.emails === true)
            return true;
        else
            return false;
    }


}]);