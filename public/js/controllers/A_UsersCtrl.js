angular.module('AUsersCtrl',[]).controller('AUsersController',['$scope', 'UserService', function($scope, UserService){

	// getAll users - every page-load
	var loadUsers = function (){
        UserService.getAll()
	    .success(function(data,status,headers,config){
            if(data.isValid){
                $scope.users = data.data;	    
            }
		    else{
                // error
            }
	    })
	    .error(function(data, status){
		    console.error('Error: ', status, data.error);
	    });
    } 

 	// remove user by ID
 	$scope.removeUser = function(userID){
 		UserService.delete(userID)
 		.success(function(data){
             if(data.isValid){
                 loadUsers();
                 // to do - hlaska
             }
             else{
                 // chyba
             }
 			$scope.users = data.data;
 		})
 		.error(function(data, status){
 			console.error('Error: ', status, data.error);
 		});
 	}
     
     loadUsers();
}]);