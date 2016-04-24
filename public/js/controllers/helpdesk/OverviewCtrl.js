// probably useless
angular.module('OverviewCtrl', []).controller('OverviewController', ['$scope', 'IssueService', '$filter', function($scope, IssueService, $filter) {

    $scope.filter = {};

    $scope.priorities = [
        { constant: undefined, text: "Vše", color: "" },
        { constant: 'LOW', text: "Nízká", color: "yellow" },
        { constant: 'NORMAL', text: "Střední", color: "orange" },
        { constant: 'HIGH', text: "Vysoká", color: "red" },
    ];

    $scope.types = [
        { constant: undefined, text: "Vše", color: "" },
        { constant: 'SYS_ERR', text: "Systémová chyba", color: "red" },
        { constant: 'QUESTION', text: "Otázka", color: "blue" },
        { constant: 'IMPROVEMENT_SUGG', text: "Návrh na zlepšení", color: "green" },
    ];

    $scope.states = [
        { constant: undefined, text: "Vše", color: "" },
        { constant: 'IN_PROGRESS', text: "V řešení", color: "red" },
        { constant: 'DONE', text: "Vyřešeno", color: "green" },
    ]
    //
    var getIssues = function() {
        IssueService.getAll()
            .success(function(data) {
                if (data.isValid) {
                    $scope.issues = data.data;
                    console.log($scope.issues);
                    openedDays();
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }

    var openedDays = function() {
        var today = $filter('date')(new Date(), "yyyy-MM-dd'T'HH:mm:ss.sss'Z'");
        var timestamp1 = new Date(today);
        $scope.issues.forEach(function(issue) {
            if (!issue.supervisor) {
                issue.supervisor = {};
                issue.supervisor.name = "nepřiřazeno";
            }
            var timestamp2 = new Date(issue.date);
            var diff = timestamp1 - timestamp2;

            $scope.dayRemaining = Math.floor(diff / 86400000);
            if ($scope.dayRemaining == 0) {
                issue.daysOpened = 1;
            }
            else {
                issue.daysOpened = $scope.dayRemaining;
            }
        })
    }

    $scope.filterState = function(state) {
        $scope.filter.state = state;
    }

    $scope.filterType = function(type) {
        $scope.filter.type = type;
    }

    $scope.filterPriority = function(priority) {
        $scope.filter.priority = priority;
    }

    getIssues();

}]);