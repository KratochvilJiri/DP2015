/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

angular.module('IssuesNewsCtrl', []).controller('IssuesNewsController', ['$scope', 'IssueService', function ($scope, IssueService) {
    // initialization
    $scope.communicationNews = [];
    // load unseen issue messages
    var loadUnseenIssueMessages = function () {
        IssueService.getUnseenMessages($scope.session.currentUser.role)
            .success(function (data) {
                if (data.isValid) {
                    $scope.data = data.data;
                    $scope.data.forEach(function (issue) {
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