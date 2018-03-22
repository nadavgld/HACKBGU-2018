// var app = angular.module('worldCupApp');

app.controller('graphController',['$scope','$http','$location','$routeParams','$cookieStore',function($scope,$http,$location,$routeParams,$cookieStore){
    $scope.math = math;
    $scope.theory = theory;
    $scope.apply = apply;
    $scope.prog = prog;

    $scope.courses = allCourses;

    $scope.coursesLoaded = $scope.courses != undefined ? true : false;

    $scope.loadCharts = function(){

        if(!$scope.coursesLoaded){
            alert("Must load courses!");
            $location.path('/');
            return;
        }

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
            data: [$scope.prog, $scope.theory, $scope.apply, $scope.math] //pull data
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
        
        $scope.recCourses = $scope.getRecCourses();

    }

    $scope.getRecCourses = function(){
        var n1;
        var n2;
        var n3;

        n1 = Math.floor(Math.random() * 7);
        n2 = Math.floor(Math.random() * 7);
        while(n2 == n1)
            n2 = Math.floor(Math.random() * 7);

        n3 = Math.floor(Math.random() * 7);
        while(n3 == n2 || n3 == n1)
            n3 = Math.floor(Math.random() * 7);

        return [allCourses[n1], allCourses[n2], allCourses[n3]];
    }
}]);
