/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

angular.module('CommunicationNewsCtrl', []).controller('CommunicationNewsController', ['$scope', 'ParticipationService','$rootScope', function($scope, ParticipationService, $rootScope) {

    $scope.communicationNews = [];
    $rootScope.loader = true;

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
            $rootScope.loader = false;
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