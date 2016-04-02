angular.module('HomeCtrl',[]).controller('HomeController',['$scope','SessionService','AuthorizationService' ,function($scope, SessionService, AuthorizationService){
	
    $scope.errors = [];
    $scope.session = SessionService;
    
    console.log($scope.session.currentUser);
    
    $scope.deauthorize = function () {
         AuthorizationService.deauthorize()
        .success(function (data) {
            SessionService.removeCurrentUser()
        })
        .error(function(data, status){
			console.error('Error', status, data.error);
		 });
    }
    
    // showing errors
    $scope.showErrors = function(errors){
        $scope.errors = errors;
        $('html,body').animate({ scrollTop: 0 }, 'slow');
        $('.message.status-alert').fadeIn();
    }
    
    // showing success operation
      $scope.showSuccess = function (message) {
       $scope.message = message;
       $('html,body').animate({ scrollTop: 0 }, 'slow');
       $('.message.status-success').fadeIn().delay(2000).fadeOut();
   }
    
}]);