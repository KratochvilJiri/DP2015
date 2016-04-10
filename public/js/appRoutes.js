// public/js/appRoutes.js

app.config(function($stateProvider, $urlRouterProvider, filepickerProvider) {
    
    filepickerProvider.setKey('ACDqZHX5DTLWEBMNdU2Jpz');

    $urlRouterProvider.otherwise('/login');
    $stateProvider

        // login to app
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginController'
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

        .state('home.helpdesk', {
            url: 'helpdesk',
            templateUrl: 'views/helpdesk.html'
        })

        .state('home.helpdeskIssue', {
            url: 'helpdesk/issueXY',
            templateUrl: 'views/helpdeskIssue.html'
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
            templateUrl: 'views/invitation.html'
        })

        .state('home.user', {
            url: 'user',
            templateUrl: 'views/user.html',
            controller: 'UserController'
        });
    // $locationProvider.html5Mode(true);

});