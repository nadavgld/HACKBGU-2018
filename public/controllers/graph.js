// var app = angular.module('worldCupApp');

app.controller('graphController',['$scope','$http','$location','$routeParams','$cookieStore',function($scope,$http,$location,$routeParams,$cookieStore){
    $scope.math = math;
    $scope.theory = theory;
    $scope.apply = apply;
    $scope.prog = prog;

    $scope.loadCharts = function(){
        var marksCanvas = document.getElementById("marksChart");
    
        Chart.defaults.global.defaultFontFamily = "sans-serif"; //define font
        Chart.defaults.global.defaultFontSize = 10;
        
        var marksData = {
            labels: [ "Programming skills","Theory", "Practical", "Math skills",],
            datasets: [{
            label: "skills",
            backgroundColor: "rgba(54, 162, 235,0.2)",
            borderColor: "rgb(54, 162, 235)",
            fill: true,
            radius: 6,
            pointRadius: 2,
            pointBorderWidth: 3,
            pointBackgroundColor: "blue",
            pointBorderColor: "rgba(54, 162, 235,0.2)",
            pointHoverRadius: 10,
            data: [prog, theory, apply, math] //pull data
            }]
        };
        
        var chartOptions = {
            responsive: false,
            scale: {
                ticks: {
                    beginAtZero: true,
                    min: 50,
                    max: 100,
                    stepSize: 10
                },
                pointLabels: {
                    fontSize: 18
                }
            },
            legend: {
                position: 'center'
            }
        };
        
        var radarChart = new Chart(marksCanvas, {
            type: 'radar',
            data: marksData,
            options: chartOptions
        });
        $("#marksChart").css("display","initial");        
    }
}]);
