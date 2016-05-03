angular.module('CommunicationNewsCtrl', []).controller('CommunicationNewsController', ['$scope', 'ParticipationService', function($scope, ParticipationService) {

    $scope.communicationNews = [];

    var processNews = function() {
        $scope.data.forEach(function(participation) {
            participation.messages.forEach(function(message) {
                if (message.author){
                    var temp = {};
                    temp.participantID = message.author._id;
                    temp.author = message.author.name;
                    temp.date = message.date;
                    $scope.communicationNews.push(temp);      
                }         
            })
        })
    }


    var loadUnseenParticipationsMessages = function() {
        ParticipationService.getUnseenMessages({ conferenceID: $scope.session.currentUser.conferenceID, role: $scope.session.currentUser.role })
            .success(function(data) {
                if (data.isValid) {
                    $scope.data = data.data;
                    processNews();
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.log('Error: ', status, data.error);
            });
    }

    loadUnseenParticipationsMessages();

}]);