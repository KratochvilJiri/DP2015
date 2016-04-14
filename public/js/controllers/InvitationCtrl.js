   // probably useless
angular.module('InvitationCtrl', []).controller('InvitationController',['$scope', 'ConferenceService', function($scope, ConferenceService) {

$scope.invitation


        ConferenceService.getActive()
        .success(function(data) {
            if (data.isValid) {
                $scope.invitation = data.data.invitation;
                console.log(data);
                console.log($scope.invitation);
            }
            else {
                $scope.showErrors(data.errors);
            }
        })
        .error(function(data, status) {
            console.log('Error: ', status, data.error);
        });
   

}]);
   
  