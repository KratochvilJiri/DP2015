angular.module('AUsersCtrl', []).controller('AUsersController', ['$scope', 'UserService', function($scope, UserService) {

    $scope.filter = {};

    $scope.roles = [];

    $scope.roles2 = [
        { constant: undefined, text: "Vše" },
        {constant: "ADMINISTRATOR", text: "Administrátor" },
        { constant: "PARTICIPANT", text: "Účastník" },
        { constant: "CONTACT_PERSON", text: "Kontaktní osoba" }
    ]

    $scope.roles["ADMINISTRATOR"] = "Administrátor";
    $scope.roles["PARTICIPANT"] = "Účastník";
    $scope.roles["CONTACT_PERSON"] = "Kontaktní osoba";
    
    $scope.filterRole = function (role) {
         $scope.filter.role = role;
    }

    // getAll users - every page-load
    var loadUsers = function() {
        UserService.getAll()
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.users = data.data;
                }
                else {
                    // error
                }
            })
            .error(function(data, status) {
                console.error('Error: ', status, data.error);
            });
    }

    // remove user by ID
    $scope.removeUser = function(userID) {
        UserService.delete(userID)
            .success(function(data) {
                if (data.isValid) {
                    loadUsers();
                    $scope.showSuccess("Uživatel byl úspěčně odstraněn");
                }
                else {
                    $scope.showError(data.errors);
                }
                $scope.users = data.data;
            })
            .error(function(data, status) {
                console.error('Error: ', status, data.error);
            });
    }

    loadUsers();
}]);