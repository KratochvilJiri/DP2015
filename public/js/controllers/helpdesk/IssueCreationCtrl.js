angular.module('IssueCreationCtrl', []).controller('IssueCreationController', ['$scope', '$filter', 'SessionService', 'IssueService', function($scope, $filter, SessionService, IssueService) {

    $scope.session = SessionService;

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

    $scope.issue = {};
    $scope.issue.state = {};

    $scope.setType = function(type) {
        $scope.issue.type = type;
    }

    $scope.setPriority = function(priority) {
        $scope.issue.priority = priority;
    }

    $scope.save = function() {
        if (!$scope.issue._id) {
            $scope.issue.date = $filter('date')(new Date(), "yyyy-MM-dd'T'HH:mm:ss.sss'Z'");
            $scope.issue.state.constant = "IN_PROGRESS";
            $scope.issue.state.color = "red";
            $scope.issue.state.text = "V řešení";
            $scope.issue.creator = $scope.session.currentUser._id;
        }
        
        IssueService.save($scope.issue)
            .success(function(data) {
                if (data.isValid) {
                    $scope.showSuccess("Problém byl úspěšně vytvořen.");
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });

        console.log($scope.issue);
    }
}]);