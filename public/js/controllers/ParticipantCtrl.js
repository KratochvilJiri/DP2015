angular.module('ParticipantCtrl', []).controller('ParticipantController', ['$scope', '$state', '$stateParams', 'UserService', 'ConferenceService', 'ParticipationService', function($scope, $state, $stateParams, UserService, ConferenceService, ParticipationService) {

    // participant (user)
    $scope.participant = {};
    // participantion that is currently showed
    $scope.participation = {};
    // all participations of user
    $scope.participations = [];
    // participant(user) - address initialization
    $scope.participant.address = {};
    // currently showed conference (participation of participant)
    $scope.conference = {};
    // new participantion of user
    $scope.newParticipation = {};
    // all participated conference
    $scope.ParticipatedConferences = [];
    // all not participated conference
    $scope.otherConferences = [];


    var setConference = function(){

        $scope.participations.forEach(function(participation){
            $scope.ParticipatedConferences.push(participation.conference);
            if(participation.conference.active){
                $scope.conference = participation.conference;
                $scope.participation = participation;
            }
        })
        if(!$scope.conference){
            $scope.conference = $scope.ParticipatedConferences[0];
            $scope.participation = $scope.participations[0];
        }
        console.log($scope.ParticipatedConferences);
        console.log($scope.conference);
        console.log($scope.participation)
    }

    // create new participation of participant
    $scope.addParticipation = function() {
        $scope.newParticipation.user = $scope.participant._id;
        $scope.newParticipation.state = "APPROVED";
        ParticipationService.save($scope.newParticipation)
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.showSuccess("Účastník byl úspěšně přidán na konferenci.");
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }

    // load participant detail
    var loadParticipant = function() {
        UserService.get($stateParams.participantId)
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.participant = data.data;
                    loadParticipations();
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }

    // load conferences, which participant didnt participate
    var loadOtherConferences = function() {
        ConferenceService.getFilteredList(getConferencesIDs($scope.participations))
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.otherConferences = data.data;
                    console.log( $scope.otherConferences);
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }
    
    // get conferences IDs from participations
    var getConferencesIDs = function(array){
        var IDsArray = [];
        array.forEach(function(object){
            IDsArray.push(object.conference._id);
        });
        return IDsArray;
    }

    // get all pariticipations of user
    var loadParticipations = function() {
        ParticipationService.getList($scope.participant._id)
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.participations = data.data;
                    console.log("participations");
                    console.log($scope.participations);
                    setConference();
                    loadOtherConferences();
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }

    // save changes in participant(user)
    $scope.saveParticipant = function() {
        if (!$scope.participant.address) {
            $scope.participant.address = {};
        }
        UserService.save($scope.participant)
            .success(function(data) {
                if (data.isValid) {
                    $scope.showSuccess("Účastník byl úspěšně aktualizován");
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }

    loadParticipant();
}]);