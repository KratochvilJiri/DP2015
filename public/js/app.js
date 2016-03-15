// public/js/app.js

var app = angular.module('conferenceApp', ['ui.router',
    'MainCtrl', 'LoginCtrl', 'DashboardCtrl', 'AUsersCtrl', 'UserCtrl','HomeCtrl',
    'UserSrvc', 'SessionSrvc', 'AuthorizationSrvc']);


app.run(function ($rootScope, $timeout) {
    $rootScope.$on('$viewContentLoaded', function () {
        $timeout(function () {
            $('.ui.dropdown').dropdown();
        }, 500);
    })
});

// session check
app.run(['$rootScope', '$location', 'SessionService', function ($rootScope, $location, SessionService) {
    // location to change
    $rootScope.$on('$stateChangeStart', function (event, next) {
        
        $rootScope.session = SessionService;
        //console.log("new page");
        SessionService.isSet()
            .success(function (data) {
                if(data.data && $rootScope.session.currentUser == null){
                    SessionService.updateCurrentUser();                 
                }
                else if(!data.data){
                    $location.path('/login');
                }
                else{
                    console.log("nic");
                }
            });
        
        //console.log("stateChanged");
        
        //SessionService.isSet()
        //.success(function (data) {
        // is not set --> login
        // console.log(data);
        // is set --> update
        //});
        
        //console.log(SessionService.currentUser);
        
        $rootScope.$watch('session.currentUser', function (data) {     
            //console.log(data);
            //console.log("watcher:");
            //console.log($rootScope.session.currentUser);
            //SessionService.isSet()
              //  .success(function (data) {
                //    console.log(data);
                //})
        })
        //if (result.data === "true") {
        //SessionService.updateCurrentUser();
        //}
        //else {
        //  $location.path('/');
        //}
    });
}]);
