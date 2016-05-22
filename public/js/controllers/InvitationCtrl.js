/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

angular.module('InvitationCtrl', []).controller('InvitationController', ['$scope', 'ConferenceService', 'UserService', 'EmailService', 'SessionService', '$rootScope', function ($scope, ConferenceService, UserService, EmailService, SessionService, $rootScope) {
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
    $scope.addressees = [];
    $scope.uninvited = [];
    $scope.invitation = {};
    $scope.invitationEmail = {};
    $scope.session = SessionService;

    // get uninvited participants
    var getUninvited = function (participants) {
        participants.forEach(function (participant) {
            if (participant.participations.length == 0)
                $scope.uninvited.push(participant);
        })
    }
    // load all participants
    var loadParticipants = function (conferenceID) {
        UserService.getUninvited(conferenceID)
            .success(function (data, status, headers, config) {
                if (data.isValid) {
                    getUninvited(data.data);
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.error('Error', status, data);
            });
    }

    // get invitation
    var getInvitation = function () {
        ConferenceService.get({ _id: $scope.session.currentUser.conferenceID, filter: "" })
            .success(function (data) {
                if (data.isValid) {
                    $scope.invitation.text = data.data.invitation;
                    loadParticipants(data.data._id);
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.log('Error: ', status, data.error);
            });
    }
    // send invitations
    $scope.sendInvitations = function () {
        EmailService.send($scope.invitation)
            .success(function (data) {
                if (data.isValid) {
                    $scope.showSuccess("Zvací email byl úspěšně odeslán.");
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.log('Error: ', status, data.error);
            });
    }

    getInvitation();



}]);

