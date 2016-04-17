angular.module('IssueCreationCtrl', []).controller('IssueCreationController',['$scope', '$filter','SessionService', function($scope, $filter, SessionService) {

    $scope.session = SessionService;

    $scope.priorities = [
        { constant: 'LOW', name: "Nízká", color: "yellow"},
        { constant: 'NORMAL', name: "Střední", color: "orange"},
        { constant: 'HIGH', name: "Vysoká", color: "red"},
    ];

    $scope.types = [
        { constant: 'SYS_ERR', name: "Systémová chyba", color: "red"},
        { constant: 'QUESTION', name: "Otázka", color: "blue"},
        { constant: 'IMPROVEMENT_SUGG', name: "Návrh na zlepšení", color: "green" },
    ];

    $scope.issue = {};

    $scope.setType = function(type) {
        $scope.issue.type = type;
    }

    $scope.setPriority = function(priority) {
        $scope.issue.priority = priority;
    }
    
    $scope.save = function () {
        if(!$scope.issue._id){
            $scope.issue.date = $filter('date')(new Date(), "yyyy-MM-dd'T'HH:mm:ss.sss'Z'");
            $scope.issue.state = "IN_PROGRESS";
            $scope.issue.creator = $scope.session.currentUser._id;
        }
        console.log($scope.issue);
    }
}]);