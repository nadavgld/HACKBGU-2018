var app = angular.module('gradeAnalytica',['ngRoute','ngCookies']);

var theory;
var apply;
var math; 
var prog;

app.config(function($routeProvider) {
    $routeProvider.when('/',{
        controller: 'MainController',
        templateUrl: 'views/index.html'
    })
    .when('/404',{
        controller: 'NotFoundController',
        templateUrl: 'views/404.html'
    })
    .when('/graph',{
        controller: 'graphController',
        templateUrl: 'views/graph.html'        
    })
    .otherwise({
        redirectTo: '/404'
    });
});

function showLoading(timeout){
    setTimeout(()=>{
        $("#loading").css("display","block");
    },timeout);
}

function hideLoading(timeout){
    setTimeout(()=>{
        $("#loading").css("display","none");
    },timeout);
}