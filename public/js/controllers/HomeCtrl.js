angular.module('HomeCtrl',[]).controller('HomeController',['$scope','SessionService' ,function($scope, SessionService){
	
    $scope.session = SessionService;
    
    
	console.log("Ready");
    
            $scope.$watch('session.currentUser', function (data) {     
            //console.log(data);
            console.log($scope.session.currentUser);
            //SessionService.isSet()
              //  .success(function (data) {
                //    console.log(data);
                //})
        })
    
}]);