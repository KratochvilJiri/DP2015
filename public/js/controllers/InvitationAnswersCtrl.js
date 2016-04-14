angular.module('InvitationAnswersCtrl', []).controller('InvitationAnswersController', ['$scope', '$state', 'EmailService', function($scope, $state, EmailService) {

    $scope.emails = [];
    $scope.loader = true;

    $scope.isActive = function(viewLocation) {
        return $scope.loader;
    };

    EmailService.getAll()
        .success(function(data, status, headers, config) {
            if (data.isValid) {
                $scope.emails = data.data.reverse();
                $scope.loader = false;
                setTimeout(function() { $('.ui.accordion').accordion(); }, 500);

            }
            else {
                $scope.showErrors(data.errors);
            }
        })
        .error(function(data, status) {
            console.error('Error', status, data);
        });

    $scope.isSeen = function(flags) {
        $scope.seen = false;
        flags.forEach(function(flag) {
            //console.log(flag);
            if (flag === "\\Seen") {
                $scope.seen = true;
            }
        });
        return $scope.seen;
    }

    $scope.markAsSeen = function(UID) {
        EmailService.markAsSeen(UID)
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.showSuccess("Email byl označen jako přečtený.");
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }

    $scope.remove = function(UID) {
        EmailService.remove(UID)
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.showSuccess("Email byl smazán.");
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }

}]);