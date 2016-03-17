angular.module('HomeCtrl',[]).controller('HomeController',['$scope','SessionService','AuthorizationService' ,function($scope, SessionService, AuthorizationService){
	
    $scope.session = SessionService;
    
    $scope.deauthorize = function () {
         AuthorizationService.deauthorize()
        .success(function (data) {
            SessionService.removeCurrentUser()
        })
        .error(function(data, status){
			console.error('Error', status, data.error);
		 });
    }
    
}]);