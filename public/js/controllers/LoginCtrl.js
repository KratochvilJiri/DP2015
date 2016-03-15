angular.module('LoginCtrl', []).controller('LoginController', ['$scope', '$location','AuthorizationService', function ($scope, $location, AuthorizationService) {

    $scope.user = {};

    $scope.authorize = function (params) {
        AuthorizationService.authorize($scope.user)
        .success(function (data) {
            if(data.data === true){
                $location.path('/');
            }
            else if (data.data === "wrong password"){
                console.log("wrong password");
                // to do - wrong password warning
            }
            else if(data.data === "user not found"){
                console.log("user not found");
                // to do - user not found
            }
        });
       
        //$scope.data =  SessionService.updateCurrentUser();
    }
    
    
        //$scope.$watch('session.currentUser', function(data){     
        //console.log(data);
        //console.log($scope.session.currentUser.data);
   // })
}]);