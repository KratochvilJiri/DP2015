// probably useless
angular.module('ParticipantsCtrl', []).controller('ParticipantsController', ['$scope', '$state', 'UserService', function($scope, $state, UserService) {

$scope.participants = [];

    var loadParticipants = function() {
        UserService.getAll("PARTICIPANTS")
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.participants = data.data;
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }
    
    loadParticipants();
}]);