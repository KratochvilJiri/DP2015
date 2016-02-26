// public/js/app.js

var app = angular.module('conferenceApp', ['ui.router', 
	'MainCtrl', 'NerdCtrl', 'LoginCtrl', 'DashboardCtrl', 'AUsersCtrl', 'ANewUserCtrl',
	'NerdService','UserSrvc']);


app.run(function ($rootScope, $timeout) {
    $rootScope.$on('$viewContentLoaded', function () {
        $timeout(function () {
            $('.ui.dropdown').dropdown();
        }, 500);
    })
});
