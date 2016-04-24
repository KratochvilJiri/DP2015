angular.module('DashboardCtrl', []).controller('DashboardController', ['$scope', '$filter', 'EmailService', 'ConferenceService', 'SessionService', 'IssueService', function($scope, $filter, EmailService, ConferenceService, SessionService, IssueService) {
    $scope.newEmails = "...";
    $scope.getDaysRemaining = "...";
    $scope.conference = {};
    $scope.session = SessionService;

    //$scope.loader.emails = false;

    var loadUnsolvedIssuesCount = function() {
        IssueService.getUnsolvedCount()
            .success(function(data) {
                if (data.isValid) {
                    $scope.unsolvedIssues = data.data;
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.log('Error: ', status, data.error);
            });
    }

    var getDaysRemaining = function(confDate) {
        var today = $filter('date')(new Date(), "yyyy-MM-dd'T'HH:mm:ss.sss'Z'");

        var timestamp1 = new Date(today);
        var timestamp2 = new Date(confDate);
        var diff = timestamp2 - timestamp1;

        $scope.dayRemaining = Math.floor(diff / 86400000);
    }

    var getNewEmailsCount = function() {
        EmailService.getNewEmailsCount()
            .success(function(data) {
                if (data.isValid) {
                    $scope.newEmails = data.data.newEmailsCount;
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.log('Error: ', status, data.error);
            });
    }

    var getParticipationsInfo = function() {
        var firstRound = true;
        $scope.conference.approvedMoney = 0;
        $scope.conference.receivedMoney = 0;
        $scope.conference.approved = 0;
        $scope.conference.invited = 0;
        $scope.conference.cancelled = 0;
        $scope.conference.complete = 0;
        $scope.conference.contractInProgress = 0;
        $scope.conference.ContractSigned = 0;
        $scope.conference.sponsorshipLevels.forEach(function(level) {
            level.count = 0;
            ['INVITED', 'CANCELLED', 'APPROVED', 'COMPLETE', 'CONTRACT_IN_PROGRESS', 'CONTRACT_SIGNED'],
                $scope.conference.participations.forEach(function(participation) {

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

                    if (firstRound && participation.sponsorshipLevel.value && participation.state === "APPROVED")
                        $scope.conference.approvedMoney = $scope.conference.approvedMoney + participation.sponsorshipLevel.value;

                    else if (firstRound && participation.sponsorshipLevel.value && participation.state === "COMPLETE")
                        $scope.conference.completeMoney = $scope.conference.completeMoney + participation.sponsorshipLevel.value;

                    if (level._id === participation.sponsorshipLevel.type._id) {
                        level.count++;
                    }
                })
            firstRound = false;
        })
    }

    var getParticAndConfInfo = function() {
        $scope.conferenceTemp = {};
        $scope.conferenceTemp._id = $scope.session.currentUser.conferenceID;
        $scope.conferenceTemp.filter = "PARTICIPANTS";
        ConferenceService.get($scope.conferenceTemp)
            .success(function(data) {
                if (data.isValid) {
                    $scope.conference = data.data;
                    getDaysRemaining(data.data.date);
                    getParticipationsInfo();
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.log('Error: ', status, data.error);
            });
    }

    var getLast5 = function() {
        ConferenceService.getLast5()
            .success(function(data) {
                if (data.isValid) {
                    $scope.otherConferences = data.data;
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.log('Error: ', status, data.error);
            });
    }

    $scope.$watch('session.currentUser', function() {
        if ($scope.session.currentUser) {
            getLast5();
            getNewEmailsCount();
            getParticAndConfInfo();
        }
    });

   loadUnsolvedIssuesCount();


}]);