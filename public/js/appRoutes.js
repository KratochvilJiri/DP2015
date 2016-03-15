// public/js/appRoutes.js

    app.config( function($stateProvider, $urlRouterProvider) {

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

        .state('home.users',{
            url: 'users',
            templateUrl: 'views/a_users.html',
            controller: 'AUsersController'
        })

        .state('home.conference',{
            url: 'conference',
            templateUrl: 'views/conference.html'
        })

        .state('home.helpdesk',{
            url:'helpdesk',
            templateUrl: 'views/helpdesk.html'
        })
        
        .state('home.helpdeskIssue', {
            url:'helpdesk/issueXY',
            templateUrl: 'views/helpdeskIssue.html'
        })

        .state('home.participants',{
            url:'participants',
            templateUrl: 'views/participants.html'
        })
        
        .state('home.participant',{
            url:'participantXY',
            templateUrl: 'views/participantDetail.html'
        })
        
       .state('home.invitation',{
            url: 'invitation',
            templateUrl: 'views/invitation.html'
        })

        .state('home.user',{
            url: 'user',
            templateUrl: 'views/user.html',
            controller: 'UserController'
        });
   // $locationProvider.html5Mode(true);

});