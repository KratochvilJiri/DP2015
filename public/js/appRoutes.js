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
            templateUrl: 'views/home.html'
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

        .state('home.user',{
            url: 'user',
            templateUrl: 'views/a_newUser.html',
            controller: 'ANewUserController'
        });
   // $locationProvider.html5Mode(true);

});