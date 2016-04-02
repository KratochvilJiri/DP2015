angular.module('ParticipantCtrl', []).controller('ParticipantController', ['$scope', '$state', '$stateParams', 'UserService', 'ConferenceService', 'ParticipationService', 'SessionService', 'MessageService', function($scope, $state, $stateParams, UserService, ConferenceService, ParticipationService, SessionService, MessageService) {
    // session structure
    $scope.session = SessionService;
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
    // new message
    $scope.message = {};


    // send new message to the server
    $scope.sendMessage = function() {
        $scope.message.date = new Date();
        $scope.message.author = $scope.session.currentUser._id;
        $scope.message.participation = $scope.participation._id;
        console.log($scope.message);
        MessageService.save($scope.message)
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.showSuccess("Zpráva byla úspěšně odeslána.");
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }

    // get sponsorshipLevel documents
    var getAttachementTypes = function() {
        $scope.conference.sponsorshipLevels.forEach(function(sponsorshipLevel) {
            if (sponsorshipLevel.name === $scope.participation.sponsorshipLevel.name)
                $scope.attachementTypes = sponsorshipLevel.attachementTypes;
        })
        console.log($scope.attachementTypes);
    }

    // add attendee to the array
    $scope.addAttendee = function() {
        if (!$scope.participation.attendees)
            $scope.participation.attendees = [];

        $scope.participation.attendees.push({});
    }

    // remove sponsorShipLevel
    $scope.removeAttendee = function(index) {
        $scope.participation.attendees.splice(index, 1);
    }

    // save updated participation
    $scope.updateParticipation = function() {
        ParticipationService.save($scope.participation)
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.showSuccess("Účast byla úspěšně atualizována.");
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }

    // set selected conference and its participation
    var setConferenceAndParticipation = function() {
        $scope.participations.forEach(function(participation) {
            $scope.ParticipatedConferences.push(participation.conference);
            if (participation.conference.active) {
                $scope.conference = participation.conference;
                $scope.participation = participation;
            }
        })
        if (!$scope.conference) {
            $scope.conference = $scope.ParticipatedConferences[0];
            $scope.participation = $scope.participations[0];
        }
        $scope.participation.messages = $scope.participation.messages.slice().reverse()
        console.log($scope.participation);
        getAttachementTypes();
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
    var getConferencesIDs = function(array) {
        var IDsArray = [];
        array.forEach(function(object) {
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
                    setConferenceAndParticipation();
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