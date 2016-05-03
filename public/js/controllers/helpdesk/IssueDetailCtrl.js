angular.module('IssueDetailCtrl', []).controller('IssueDetailController', ['$scope', '$state', '$filter', 'SessionService', 'IssueService', '$stateParams', 'UserService', 'MessageService', function ($scope, $state, $filter, SessionService, IssueService, $stateParams, UserService, MessageService) {

    $scope.session = SessionService;
    $scope.supervisors = [];

    $scope.priorities = [
        { constant: 'LOW', text: "Nízká", color: "yellow" },
        { constant: 'NORMAL', text: "Střední", color: "orange" },
        { constant: 'HIGH', text: "Vysoká", color: "red" },
    ];

    $scope.types = [
        { constant: 'SYS_ERR', text: "Systémová chyba", color: "red" },
        { constant: 'QUESTION', text: "Otázka", color: "blue" },
        { constant: 'IMPROVEMENT_SUGG', text: "Návrh na zlepšení", color: "green" },
    ];

    $scope.states = [
        { constant: 'IN_PROGRESS', text: "V řešení", color: "red" },
        { constant: 'DONE', text: "Vyřešeno", color: "green" },
    ]

    $scope.issue = {};
    $scope.issue.state = {};

    $scope.setType = function (type) {
        $scope.issue.type = type;
    }

    $scope.setPriority = function (priority) {
        $scope.issue.priority = priority;
    }

    $scope.setState = function (state) {
        $scope.issue.state = state;
    }

    $scope.save = function () {
        if (!$scope.issue._id) {
            $scope.issue.date = $filter('date')(new Date(), "yyyy-MM-dd'T'HH:mm:ss.sss'Z'");
            $scope.issue.state.constant = "IN_PROGRESS";
            $scope.issue.state.color = "red";
            $scope.issue.state.text = "V řešení";
            $scope.issue.creator = $scope.session.currentUser._id;
        }

        IssueService.save($scope.issue)
            .success(function (data) {
                if (data.isValid) {
                    $scope.showSuccess("Problém byl úspěšně vytvořen/aktualizován.");
                    $state.go('home.helpdeskOverview');
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.error('Error', status, data);
            });

    }

    var loadIssue = function () {
        IssueService.get($stateParams.issueId)
            .success(function (data) {
                if (data.isValid) {
                    $scope.issue = data.data;
                    openedDays();
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.error('Error', status, data);
            });
    }

    var openedDays = function () {
        var today = $filter('date')(new Date(), "yyyy-MM-dd'T'HH:mm:ss.sss'Z'");
        var timestamp1 = new Date(today);

        if (!$scope.issue.supervisor) {
            $scope.issue.supervisor = {};
            $scope.issue.supervisor.name = "nepřiřazeno";
        }
        var timestamp2 = new Date($scope.issue.date);
        var diff = timestamp1 - timestamp2;

        $scope.dayRemaining = Math.floor(diff / 86400000);
        if ($scope.dayRemaining == 0) {
            $scope.issue.daysOpened = 1;
        }
        else {
            $scope.issue.daysOpened = $scope.dayRemaining;
        }
    }

    var loadSupervisors = function () {
        UserService.getAll("NOT_PARTICIPANT")
            .success(function (data) {
                if (data.isValid) {
                    $scope.supervisors = data.data;
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.error('Error', status, data);
            });
    }

    // send new message to the server
    $scope.sendMessage = function () {
        $scope.message.date = new Date();
        $scope.message.author = $scope.session.currentUser._id;
        $scope.message.userRole = $scope.session.currentUser.role;
        $scope.message.issue = $scope.issue._id;
        $scope.message.seen = false;
        MessageService.save($scope.message)
            .success(function (data, status, headers, config) {
                if (data.isValid) {
                    $scope.showSuccess("Zpráva byla úspěšně odeslána.");
                    $scope.message = {};
                    loadIssue();
                    loadSupervisors();
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.error('Error', status, data);
            });
    }

    $scope.markAsSeen = function (message) {
        message.seen = true;
        MessageService.save(message)
            .success(function (data, status, headers, config) {
                if (data.isValid) {
                    $scope.showSuccess("Zpráva byla označena za přečtenou.");
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.error('Error', status, data);
            });
    }

    if ($stateParams.issueId) {
        loadIssue();
        loadSupervisors();
    }


}]);