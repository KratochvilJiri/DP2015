/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

angular.module('ParticipantsCtrl', []).controller('ParticipantsController', ['$scope', '$state', 'UserService', 'ConferenceService', 'ParticipationService', '$rootScope', function ($scope, $state, UserService, ConferenceService, ParticipationService, $rootScope) {
    // active menu structure
    $rootScope.menu = {
        dashboard: false,
        actionAdministration: false,
        helpdesk: false,
        participants: true,
        administration: false,
        profile: false
    }
    // initialization
    $scope.deletingUser = "";
    $rootScope.loader = true;
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

    // show modal for confirm operation
    $scope.showModal = function (participantID) {
        $scope.deletingUser = participantID;
        setTimeout(function () { $('.small.modal').modal('show'); }, 50);
    }
    $scope.closeModal = function () {
        setTimeout(function () { $('.small.modal').modal('hide'); }, 50);
        $scope.deletingUser = "";
    }
    // load participants
    var loadParticipants = function () {
        UserService.getAll("PARTICIPANTS")
            .success(function (data, status, headers, config) {
                if (data.isValid) {
                    $scope.participants = data.data;
                    $scope.participantsBackup = data.data;
                    $rootScope.loader = false;
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.error('Error', status, data);
            });
    }
    // load conferences
    var loadConferences = function () {
        ConferenceService.getListNames()
            .success(function (data, status, headers, config) {
                if (data.isValid) {
                    $scope.conferences = data.data;
                    $scope.conferences.push({ name: "Vše", _id: undefined });
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.error('Error', status, data);
            });
    }
    // get participants - proces informations
    var getParticipants = function () {
        $scope.participants = [];
        $scope.participations.forEach(function (participation) {
            participation.user.state = participation.state;
            if (participation.sponsorshipLevel && participation.sponsorshipLevel.type) {
                participation.user.level = participation.sponsorshipLevel.type._id;
            }           
            $scope.participants.push(participation.user);
        });
    }
    // filter participants by conference
    $scope.filterConference = function (conference) {
        if (conference._id) {
            if ($scope.pushedAll) {
                conference.sponsorshipLevels.unshift({ _id: undefined, name: "Vše" });
                $scope.pushedAll = false;
            }
            $scope.conference = conference;
            $scope.filter.conferenceFilter = true;
            $scope.filter.state = {};
            $scope.filter.level = {};
            setTimeout(function () { $('.ui.dropdown').dropdown(); }, 500);

            ParticipationService.getListByConference(conference._id)
                .success(function (data, status, headers, config) {
                    if (data.isValid) {
                        $scope.participations = data.data;
                        getParticipants();
                    }
                    else {
                        $scope.showErrors(data.errors);
                    }
                })
                .error(function (data, status) {
                    console.error('Error', status, data);
                });

            // to do - dotaz na participations dle konference id, vcetne uzivatelu 
        }
        else {
            $scope.participants = $scope.participantsBackup;
            $scope.filter.conferenceFilter = false;
            $scope.filter.level = undefined;
            $scope.filter.state = undefined;
            
        }
    }
    // filter participants by level
    $scope.filterLevel = function (level) {
        $scope.filter.level = level;
    }
    // filter participants by state
    $scope.filterState = function (state) {
        $scope.filter.state = state;
    }
    // remove participant
    $scope.removeUser = function () {
        UserService.delete($scope.deletingUser)
            .success(function (data) {
                if (data.isValid) {
                    loadConferences();
                    loadParticipants();
                    setTimeout(function () { $('.small.modal').modal('hide'); }, 50);
                    $scope.showSuccess("Uživatel byl úspěšně odstraněn");
                }
                else {
                    setTimeout(function () { $('.small.modal').modal('hide'); }, 50);
                    $scope.showErrors(data.errors);
                }
                $scope.users = data.data;
            })
            .error(function (data, status) {
                console.error('Error: ', status, data.error);
            });
    }

    loadConferences();
    loadParticipants();
}]);