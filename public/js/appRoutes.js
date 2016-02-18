// public/js/appRoutes.js

    app.config( function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/login');
        $stateProvider

        // login to app
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html'
        })

        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'views/dashboard.html'
        })

        .state('users',{
            url: '/users',
            templateUrl: 'view/users.html'
        });
   // $locationProvider.html5Mode(true);

});