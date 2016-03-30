angular.module('ParticipantCtrl', []).controller('ParticipantController', ['$scope', '$state', '$stateParams', 'UserService', function($scope, $state, $stateParams, UserService) {

$scope.participant = {};
$scope.participant.address = {};


    var loadParticipant = function() {
        UserService.get($stateParams.participantId)
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.participant = data.data;
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }
    
    $scope.saveParticipant = function () {
        if(!$scope.participant.address){
            $scope.participant.address = {};
        }
        UserService.save($scope.participant)
            .success(function(data) {
                if(data.isValid){
                    $scope.showSuccess("Účastník byl úspěšně aktualizován");
                }
                else{
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }
    
    loadParticipant();
    
}]);