// public/js/app.js

var app = angular.module('conferenceApp', ['ui.router', 
	'MainCtrl', 'LoginCtrl', 'DashboardCtrl', 'AUsersCtrl', 'ANewUserCtrl',
	'UserSrvc']);


app.run(function ($rootScope, $timeout) {
    $rootScope.$on('$viewContentLoaded', function () {
        $timeout(function () {
            $('.ui.dropdown').dropdown();
        }, 500);
    })
});
