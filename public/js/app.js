// public/js/app.js

var app = angular.module('conferenceApp', ['ui.router', 
	'MainCtrl', 'NerdCtrl', 'LoginCtrl', 'DashboardCtrl', 'AUsersCtrl', 'ANewUserCtrl',
	'NerdService','UserSrvc']);