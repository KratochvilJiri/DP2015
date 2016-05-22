/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

angular.module('AUsersCtrl', []).controller('AUsersController', ['$scope', 'UserService', function ($scope, UserService) {

    $scope.filter = {};
    $scope.deletingUser = "";
    $scope.roles = [];

    $scope.roles2 = [
        { constant: undefined, text: "Vše" },
        { constant: "ADMINISTRATOR", text: "Administrátor" },
        { constant: "PARTICIPANT", text: "Účastník" },
        { constant: "CONTACT_PERSON", text: "Kontaktní osoba" }
    ]

    $scope.roles["ADMINISTRATOR"] = "Administrátor";
    $scope.roles["PARTICIPANT"] = "Účastník";
    $scope.roles["CONTACT_PERSON"] = "Kontaktní osoba";

    $scope.filterRole = function (role) {
        $scope.filter.role = role;
    }

    $scope.showModal = function (participantID) {
        $scope.deletingUser = participantID;
        setTimeout(function () { $('.small.modal').modal('show'); }, 50);
    }
    $scope.closeModal = function () {
        setTimeout(function () { $('.small.modal').modal('hide'); }, 50);
        $scope.deletingUser = "";
    }
    // getAll users - every page-load
    var loadUsers = function () {
        UserService.getAll()
            .success(function (data, status, headers, config) {
                if (data.isValid) {
                    $scope.users = data.data;
                }
                else {
                    // error
                }
            })
            .error(function (data, status) {
                console.error('Error: ', status, data.error);
            });
    }

    // remove user by ID
    $scope.removeUser = function () {
        UserService.delete($scope.deletingUser)
            .success(function (data) {
                if (data.isValid) {
                    loadUsers();
                    setTimeout(function () { $('.small.modal').modal('hide'); }, 50);
                    $scope.showSuccess("Uživatel byl úspěčně odstraněn");
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.error('Error: ', status, data.error);
            });
    }

    loadUsers();
}]);