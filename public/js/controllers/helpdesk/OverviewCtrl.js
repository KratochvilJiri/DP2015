// probably useless
angular.module('OverviewCtrl', []).controller('OverviewController', ['$scope', 'IssueService', function($scope, IssueService) {

    //
    var getIssues = function() {
        IssueService.getAll()
            .success(function(data) {
                if (data.isValid) {
                    $scope.issues = data.data;
                    console.log($scope.issues);
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }
    getIssues();

}]);