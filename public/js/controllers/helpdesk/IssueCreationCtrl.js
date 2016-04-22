angular.module('IssueCreationCtrl', []).controller('IssueCreationController', ['$scope', '$filter', 'SessionService', 'IssueService', function($scope, $filter, SessionService, IssueService) {

    $scope.session = SessionService;

    $scope.priorities = [
        { constant: 'LOW', name: "Nízká", color: "yellow" },
        { constant: 'NORMAL', name: "Střední", color: "orange" },
        { constant: 'HIGH', name: "Vysoká", color: "red" },
    ];

    $scope.types = [
        { constant: 'SYS_ERR', name: "Systémová chyba", color: "red" },
        { constant: 'QUESTION', name: "Otázka", color: "blue" },
        { constant: 'IMPROVEMENT_SUGG', name: "Návrh na zlepšení", color: "green" },
    ];

    $scope.issue = {};
    $scope.issue.colors = {};

    $scope.setType = function(type) {
        $scope.issue.type = type.constant;
        $scope.issue.colors.type = type.color;
    }

    $scope.setPriority = function(priority) {
        $scope.issue.priority = priority.constant;
        $scope.issue.colors.priority = priority.color;
    }

    $scope.save = function() {
        if (!$scope.issue._id) {
            $scope.issue.date = $filter('date')(new Date(), "yyyy-MM-dd'T'HH:mm:ss.sss'Z'");
            $scope.issue.state = "IN_PROGRESS";
            $scope.issue.colors.state = "red";
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