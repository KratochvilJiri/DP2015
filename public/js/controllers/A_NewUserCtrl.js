angular.module("ANewUserCtrl",[]).controller("ANewUserController", function($scope){
 console.log("ready");

 $scope.user = {};

 $scope.createUser = function () {
 	 console.log($scope.user); 
 }

});