// public/js/appRoutes.js

app.config(function ($stateProvider, $urlRouterProvider, filepickerProvider) {

    filepickerProvider.setKey('ACDqZHX5DTLWEBMNdU2Jpz');

    $urlRouterProvider.otherwise('/login');
    $stateProvider

        // login to app
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })

        .state('passwordRecovery', {
            url: '/passwordRecovery',
            templateUrl: 'views/passwordRecovery.html',
            controller: 'PasswordRecoveryController'
        })

        .state('home', {
            url: '/',
            abstract: true,
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })


        .state('home.dashboard', {
            url: '',
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardController'
        })

        .state('home.communicationNews', {
            url: 'communicationNews',
            templateUrl: 'views/communicationNews.html',
            controller: 'CommunicationNewsController'
        })


        .state('home.invitationAnswers', {
            url: 'invitationAnswers',
            templateUrl: 'views/invitationAnswers.html',
            controller: 'InvitationAnswersController'
        })

        .state('home.helpdeskOverview', {
            url: 'helpdesk',
            templateUrl: 'views/helpdesk/overview.html',
            controller: 'OverviewController'
        })

        .state('home.helpdeskIssue', {
            url: 'helpdesk/issueDetail/{issueId}',
            templateUrl: 'views/helpdesk/issueDetail.html',
            controller: 'IssueDetailController'
        })

        .state('home.helpdeskIssueCreation', {
            url: 'helpdesk/issueCreation',
            templateUrl: 'views/helpdesk/issueCreation.html',
            controller: 'IssueDetailController'
        })

        .state('home.helpdeskNews', {
            url: 'helpdesk/news',
            templateUrl: 'views/helpdesk/issuesNews.html',
            controller: 'IssuesNewsController'
        })

        .state('home.participants', {
            url: 'participants',
            templateUrl: 'views/participants.html',
            controller: 'ParticipantsController'
        })

        .state('home.administration', {
            url: 'administration',
            templateUrl: 'views/administration/'
        })

        .state('home.administration.users', {
            url: '/users',
            templateUrl: 'views/administration/users.html',
            controller: 'AUsersController'
        })

        .state('home.administration.conference', {
            url: '/conference',
            templateUrl: 'views/administration/conference.html',
            controller: 'ConferenceController'
        })

        .state('home.participant', {
            url: 'participant/{participantId}',
            templateUrl: 'views/participant/',
            controller: 'ParticipantController'
        })

        .state('home.participant.communication', {
            url: '/communication',
            templateUrl: 'views/participant/communication.html'
        })

        .state('home.participant.documents', {
            url: '/documents',
            templateUrl: 'views/participant/documents.html'
        })

        .state('home.participant.information', {
            url: '/information',
            templateUrl: 'views/participant/information.html'
        })

        .state('home.participant.representatives', {
            url: '/representatives',
            templateUrl: 'views/participant/representatives.html'
        })

        .state('home.invitation', {
            url: 'invitation',
            templateUrl: 'views/invitation.html',
            controller: 'InvitationController'
        })

        .state('home.user', {
            url: 'user/{userId}',
            templateUrl: 'views/user.html',
            controller: 'UserController'
        });
    // $locationProvider.html5Mode(true);

});