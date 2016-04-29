angular.module('IssuesNewsCtrl', []).controller('IssuesNewsController', ['$scope', 'IssueService', function ($scope, IssueService) {

    $scope.communicationNews = [];

    var loadUnseenIssueMessages = function () {
        IssueService.getUnseenMessages($scope.session.currentUser.role)
            .success(function (data) {
                if (data.isValid) {
                    $scope.data = data.data;
                    $scope.data.forEach(function (issue) {
                        console.log(issue);
                        issue.messages.forEach(function (message) {
                            if (message.author) {
                                var temp = {};
                                temp.issueID = message.issue;
                                temp.author = message.author.name;
                                temp.date = message.date;
                                temp.issueName = issue.name;
                                $scope.communicationNews.push(temp);
                            }
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

    loadUnseenIssueMessages();

}]);