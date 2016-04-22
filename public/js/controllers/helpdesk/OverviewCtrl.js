// probably useless
angular.module('OverviewCtrl', []).controller('OverviewController', ['$scope', 'IssueService','$filter', function($scope, IssueService, $filter) {

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
            if(!issue.supervisor){
                issue.supervisor = {};
                issue.supervisor.name = "nepřiřazeno";
            }
            var timestamp2 = new Date(issue.date);
            var diff = timestamp1 - timestamp2;

            $scope.dayRemaining = Math.floor(diff / 86400000);
            if($scope.dayRemaining == 0){
                issue.daysOpened = 1;
            }
            else{
                issue.daysOpened = $scope.dayRemaining;
            }
        })
    }

    getIssues();

}]);