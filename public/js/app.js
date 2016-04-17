// public/js/app.js

var app = angular.module('conferenceApp', ['ui.router', 'multipleSelect', 'formatters', 'angular-filepicker',
    'MainCtrl', 'LoginCtrl', 'DashboardCtrl', 'AUsersCtrl', 'UserCtrl', 'HomeCtrl', 'ConferenceCtrl', 'ParticipantsCtrl', 'ParticipantCtrl', 'InvitationAnswersCtrl','InvitationCtrl','IssueCreationCtrl',
    'UserSrvc', 'SessionSrvc', 'AuthorizationSrvc', 'ConferenceSrvc', 'ParticipationSrvc', 'MessageSrvc', 'AttachementSrvc', 'EmailSrvc']);


app.run(function($rootScope, $timeout) {
    $rootScope.$on('$viewContentLoaded', function() {
        $timeout(function() {
            $('.ui.dropdown').dropdown();
            $('.menu .item').tab();
            $('.ui.basic.icon.button').popup();
            $('.message .close').on('click', function() {
                $(this).closest('.message').fadeOut(200);
            });
            $('.ui.accordion').accordion();
        }, 500);
    })
});

// session check
app.run(['$rootScope', '$state', 'SessionService', function($rootScope, $state, SessionService) {
    // location to change
    $rootScope.$on('$stateChangeStart', function(event, next) {

        SessionService.isSet()
            .success(function(data) {
                if (data.isValid && SessionService.currentUser == null) {
                    SessionService.updateCurrentUser();
                }
                else if (!data.isValid) {
                    $state.go('login');
                }
            });
    });
}]);
