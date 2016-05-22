/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

var app = angular.module('conferenceApp', ['ui.router', 'multipleSelect', 'angular-filepicker',
    'LoginCtrl', 'DashboardCtrl', 'AUsersCtrl', 'UserCtrl', 'HomeCtrl', 'ConferenceCtrl', 'ParticipantsCtrl', 'ParticipantCtrl', 'InvitationAnswersCtrl', 'InvitationCtrl', 'IssueDetailCtrl', 'OverviewCtrl', 'CommunicationNewsCtrl', 'IssuesNewsCtrl', 'PasswordRecoveryCtrl',
    'UserSrvc', 'SessionSrvc', 'AuthorizationSrvc', 'ConferenceSrvc', 'ParticipationSrvc', 'MessageSrvc', 'AttachementSrvc', 'EmailSrvc', 'IssueSrvc']);


app.run(function ($rootScope, $timeout) {
    $rootScope.$on('$viewContentLoaded', function () {
        $timeout(function () {
            $('.ui.dropdown').dropdown();
            $('.menu .item').tab();
            $('.ui.basic.icon.button').popup();
            $('.info.icon').popup();
            $( "input.datepicker" ).datepicker({
                dateFormat: "yy/mm/dd"
            });
            $('.message .close').on('click', function () {
                $(this).closest('.message').fadeOut(200);
            });
            $('.ui.accordion').accordion();
        }, 500);
    })
});

// session check
app.run(['$rootScope', '$state', 'SessionService', function ($rootScope, $state, SessionService) {
    // location to change
    $rootScope.$on('$stateChangeStart', function (event, next) {
        $('.ui.basic.icon.button').popup('destroy');
        //$('.info.icon').popup('destroy');
        if ($state.current.name != "login" && $state.current.name != "passwordRecovery") {
            SessionService.isSet()
                .success(function (data) {
                    if (data.isValid && SessionService.currentUser == null) {
                        SessionService.updateCurrentUser();
                    }
                    else if (!data.isValid) {
                        $state.go('login');
                    }
                });
        }
    });
}]);
