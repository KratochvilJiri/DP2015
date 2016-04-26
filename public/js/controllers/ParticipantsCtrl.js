angular.module('ParticipantsCtrl', []).controller('ParticipantsController', ['$scope', '$state', 'UserService', 'ConferenceService', 'ParticipationService', function($scope, $state, UserService, ConferenceService, ParticipationService) {

    $scope.participants = [];
    $scope.filter = {};
    $scope.filter.conferenceFilter = false;
    $scope.states = [
        { constant: undefined, text: "Vše" },
        { constant: "INVITED", text: "Pozván" },
        { constant: "CANCELLED", text: "Odmítnuto" },
        { constant: "APPROVED", text: "Přislíbeno" },
        { constant: "COMPLETE", text: "Potvrzeno" },
        { constant: "CONTRACT_IN_PROGRESS", text: "Smlouva v jednání" },
        { constant: "CONTRACT_SIGNED", text: "Smlouva podepsána" },
    ];
    $scope.groups = [];
    $scope.pushedAll = true;

    var loadParticipants = function() {
        UserService.getAll("PARTICIPANTS")
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.participants = data.data;
                    $scope.participantsBackup = data.data;
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }

    var loadConferences = function() {
        ConferenceService.getListNames()
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.conferences = data.data;
                    $scope.conferences.push({ name: "Vše", _id: undefined });
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }

    var getParticipants = function() {
        $scope.participants = [];
        $scope.participations.forEach(function(participation) {
            participation.user.state = participation.state;
            if (participation.sponsorshipLevel.type) {
                participation.user.level = participation.sponsorshipLevel.type._id;
            }
            $scope.participants.push(participation.user);
        });
    }

    $scope.filterConference = function(conference) {
        if (conference._id) {
            if ($scope.pushedAll) {
                conference.sponsorshipLevels.unshift({ _id: undefined, name: "Vše" });
                $scope.pushedAll = false;
            }
            $scope.conference = conference;
            $scope.filter.conferenceFilter = true;
            $scope.filter.state = {};
            $scope.filter.level = {};
            setTimeout(function() { $('.ui.dropdown').dropdown(); }, 500);

            ParticipationService.getListByConference(conference._id)
                .success(function(data, status, headers, config) {
                    if (data.isValid) {
                        $scope.participations = data.data;
                        getParticipants();
                    }
                    else {
                        $scope.showErrors(data.errors);
                    }
                })
                .error(function(data, status) {
                    console.error('Error', status, data);
                });

            // to do - dotaz na participations dle konference id, vcetne uzivatelu 
        }
        else {
            $scope.participants = $scope.participantsBackup;
            $scope.filter.conferenceFilter = false;
        }
    }

    $scope.filterLevel = function(level) {
        $scope.filter.level = level;
    }

    $scope.filterState = function(state) {
        $scope.filter.state = state;
    }

    loadConferences();
    loadParticipants();
}]);