angular.module('DashboardCtrl', []).controller('DashboardController', ['$scope', '$filter', 'EmailService', 'ConferenceService', 'SessionService', 'IssueService', 'ParticipationService', '$rootScope', function ($scope, $filter, EmailService, ConferenceService, SessionService, IssueService, ParticipationService, $rootScope) {

    $rootScope.menu = {
        dashboard: true,
        actionAdministration: false,
        helpdesk: false,
        participants: false,
        administration: false,
        profile: false
    }

    $scope.newEmails = "...";
    $scope.getDaysRemaining = "...";
    $scope.conference = {};
    $scope.unseenMessagesCount = 0;
    $scope.unseenParticipationMessagesCount = 0;
    $scope.activeConferenceParticipation = false;

    $scope.session.conferenceID = undefined;
    $scope.session.currentUser = SessionService.updateCurrentUser();

    $rootScope.loader = true;
    //$scope.session = SessionService;

    //$scope.loader.emails = false;

    var loadUnseenParticipationsMessages = function () {
        ParticipationService.getUnseenMessages({ conferenceID: $scope.session.currentUser.conferenceID, role: $scope.session.currentUser.role })
            .success(function (data) {
                if (data.isValid) {
                    $scope.unseenParticipationMessagesCount = 0;
                    $scope.data = data.data;
                    $scope.data.forEach(function (participation) {
                        participation.messages.forEach(function (message) {
                            if (message.author)
                                $scope.unseenParticipationMessagesCount++;
                        })
                    })
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.log('Error: ', status, data.error);
            });
    }


    var loadUnseenIssueMessages = function () {
        $scope.unseenMessagesCount = 0;
        IssueService.getUnseenMessages($scope.session.currentUser.role)
            .success(function (data) {
                if (data.isValid) {
                    $scope.data = data.data;
                    $scope.data.forEach(function (issue) {
                        issue.messages.forEach(function (message) {
                            if (message.author)
                                $scope.unseenMessagesCount++;
                        })
                    })
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.log('Error: ', status, data.error);
            });
    }

    var loadUnsolvedIssuesCount = function () {
        IssueService.getUnsolvedCount()
            .success(function (data) {
                if (data.isValid) {
                    $scope.unsolvedIssues = data.data;
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.log('Error: ', status, data.error);
            });
    }

    var getDaysRemaining = function (confDate) {
        var today = $filter('date')(new Date(), "yyyy-MM-dd'T'HH:mm:ss.sss'Z'");

        var timestamp1 = new Date(today);
        var timestamp2 = new Date(confDate);
        var diff = timestamp2 - timestamp1;

        $scope.dayRemaining = Math.floor(diff / 86400000);
    }

    var getNewEmailsCount = function () {
        EmailService.getNewEmailsCount()
            .success(function (data) {
                if (data.isValid) {
                    $scope.newEmails = data.data.newEmailsCount;
                    $rootScope.loader = false;
                }
                else {
                    $scope.showErrors(data.errors);
                    $rootScope.loader = false;
                }
            })
            .error(function (data, status) {
                console.log('Error: ', status, data.error);
            });
    }

    var getParticipationsInfo = function () {
        var firstRound = true;
        $scope.conference.approvedMoney = 0;
        $scope.conference.receivedMoney = 0;
        $scope.conference.approved = 0;
        $scope.conference.invited = 0;
        $scope.conference.cancelled = 0;
        $scope.conference.complete = 0;
        $scope.conference.contractInProgress = 0;
        $scope.conference.ContractSigned = 0;
        $scope.conference.sponsorshipLevels.forEach(function (level) {
            level.count = 0;
            ['INVITED', 'CANCELLED', 'APPROVED', 'COMPLETE', 'CONTRACT_IN_PROGRESS', 'CONTRACT_SIGNED'],
                $scope.conference.participations.forEach(function (participation) {

                    if (participation.state === "APPROVED" && firstRound) {
                        $scope.conference.approved++;
                    }
                    else if (participation.state === "INVITED" && firstRound) {
                        $scope.conference.invited++;
                    }
                    else if (participation.state === "CANCELLED" && firstRound) {
                        $scope.conference.cancelled++;
                    }
                    else if (participation.state === "COMPLETE" && firstRound) {
                        $scope.conference.complete++;
                    }
                    else if (participation.state === "CONTRACT_IN_PROGRESS" && firstRound) {
                        $scope.conference.approved++;
                    }
                    else if (participation.state === "CONTRACT_SIGNED" && firstRound) {
                        $scope.conference.complete++;
                    }

                    if (participation.sponsorshipLevel) {
                        if (firstRound && participation.sponsorshipLevel.value && participation.state == "APPROVED")
                            $scope.conference.approvedMoney = $scope.conference.approvedMoney + participation.sponsorshipLevel.value;

                        else if (firstRound && participation.sponsorshipLevel.value && (participation.state == "COMPLETE" || participation.state == "CONTRACT_SIGNED")){
                            $scope.conference.receivedMoney = $scope.conference.receivedMoney + participation.sponsorshipLevel.value;}

                        if (level._id === participation.sponsorshipLevel.type._id) {
                            level.count++;
                        }
                    }
                })
            firstRound = false;
        })
    }

    var getParticAndConfInfo = function () {
        $scope.conferenceTemp = {};
        $scope.conferenceTemp._id = $scope.session.currentUser.conferenceID;
        $scope.conferenceTemp.filter = "PARTICIPANTS";
        ConferenceService.get($scope.conferenceTemp)
            .success(function (data) {
                if (data.isValid) {
                    $scope.conference = data.data;
                    getDaysRemaining(data.data.date);
                    getParticipationsInfo();
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.log('Error: ', status, data.error);
            });
    }

    var getLast5 = function () {
        ConferenceService.getLast5()
            .success(function (data) {
                if (data.isValid) {
                    $scope.otherConferences = data.data;
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.log('Error: ', status, data.error);
            });
    }

    var getUserParticipations = function () {
        ParticipationService.getList($scope.session.currentUser._id)
            .success(function (data) {
                if (data.isValid) {
                    $scope.participations = data.data;
                    checkActiveConferenceParticipation();
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.log('Error: ', status, data.error);
            });
    }

    var checkActiveConferenceParticipation = function () {
        $scope.participations.forEach(function (participation) {
            if (participation.conference.active) {
                $scope.conference = participation.conference;
                $scope.activeConferenceParticipation = true;
                $scope.participation = participation;
                getAttachementTypes();
                getDaysRemaining($scope.conference.date);
                newMessages();
            }
        })
    }

    // get sponsorshipLevel documents
    var getAttachementTypes = function () {
        $scope.attachementTypes = [];
        $scope.conference.sponsorshipLevels.forEach(function (sponsorshipLevel) {
            if ($scope.participation.sponsorshipLevel) {
                if (sponsorshipLevel._id === $scope.participation.sponsorshipLevel.type._id)
                    $scope.attachementTypes = sponsorshipLevel.attachementTypes;
            }
            else {
                $scope.attachementTypes = [];
            }
        })

        assignAttachement();
    }

    var assignAttachement = function () {

        $scope.participation.attachements.forEach(function (attachement) {
            $scope.attachementTypes.forEach(function (attachementType) {
                if (attachementType.hash === attachement.hash)
                    attachementType.attachement = attachement;
            })
        })
    }

    var newMessages = function () {
        $scope.participation.newMessage = {};
        $scope.participation.newMessage.check = false;
        $scope.participation.messages.forEach(function (message) {
            if (!message.seen && message.author.role != "PARTICIPANT") {
                $scope.participation.newMessage.check = true;
                $scope.participation.newMessage.author = message.author.name;
            }
        })
        $rootScope.loader = false;
    }



    $scope.$watch('session.currentUser', function () {
        if ($scope.session.currentUser) {
            if ($scope.session.currentUser.role != "PARTICIPANT" && $scope.session.currentUser.conferenceID) {
                getLast5();
                getNewEmailsCount();
                getParticAndConfInfo();
                loadUnseenIssueMessages();
                loadUnseenParticipationsMessages();
            }

            else if ($scope.session.currentUser.role == "PARTICIPANT") {
                getUserParticipations();
            }
            else{
                $rootScope.loader = false;
            }
        }
    });
    loadUnsolvedIssuesCount();


}]);