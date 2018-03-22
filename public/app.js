var app = angular.module('worldCupApp',['ngRoute','ngCookies']);

app.config(function($routeProvider) {
    $routeProvider.when('/',{
        controller: 'MainController',
        templateUrl: 'views/index.html'
    })
    // .when('/scores',{
    //     controller: 'ScoresController',
    //     templateUrl: 'views/scores.html'
    // })
    .otherwise({
        redirectTo: '/404'
    });
});
