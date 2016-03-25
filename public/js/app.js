// public/js/app.js

var app = angular.module('conferenceApp', ['ui.router',
    'MainCtrl', 'LoginCtrl', 'DashboardCtrl', 'AUsersCtrl', 'UserCtrl','HomeCtrl','ConferenceCtrl',
    'UserSrvc', 'SessionSrvc', 'AuthorizationSrvc', 'ConferenceSrvc']);


app.run(function ($rootScope, $timeout) {
    $rootScope.$on('$viewContentLoaded', function () {
        $timeout(function () {
            $('.ui.dropdown').dropdown();
            $('.menu .item').tab();
            $('.ui.basic.icon.button').popup();
            $('.message .close').on('click', function(){
               $(this).closest('.message').fadeOut(200); 
            });
        }, 500);
    })
});

// session check
app.run(['$rootScope', '$state', 'SessionService', function ($rootScope, $state, SessionService) {
    // location to change
    $rootScope.$on('$stateChangeStart', function (event, next) {
        
        SessionService.isSet()
            .success(function (data) {
                if(data.isValid && SessionService.currentUser == null){
                    SessionService.updateCurrentUser();                 
                }
                else if(!data.isValid){
                    $state.go('login');
                }
            });
    });
}]);
