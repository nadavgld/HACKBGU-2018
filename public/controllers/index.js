// var app = angular.module('worldCupApp');
var username = "nadavgri";

app.controller('MainController',['$scope','$http','$location','$routeParams','$httpParamSerializerJQLike',function($scope,$http,$location,$routeParams,$httpParamSerializerJQLike){
    $scope.formSelection = {};
    $scope.welcome = "Grade Analytica";
    $scope.formDepartments = ["Software and Information Systems Engineering"];
    $scope.showSemesters = false;
    $scope.showCourses = false;
    $scope.courses = [];

    $scope.user;
    $scope.fetchUserData = function(){
        showLoading(0);

        $http.get('/users/' + username).then(function(data){
            $scope.user = data.data;
            $scope.user.semesters = JSON.parse($scope.user.semesters);

            console.log($scope.user);
            hideLoading(0);
        });
    }

    $scope.updateSemesters = function(){
        $scope.formSemesters = ["1","2","3","4","5","6","7","8","Graduated"];
        $scope.showSemesters = true;
    }

    $scope.updateCourses = function(){
        var sem = $scope.formSelection.semester == "Graduated" ? 9 : $scope.formSelection.semester;
        var dept = $scope.formSelection.dept;

        $http.get('/departments/' + dept).then(function(data){
            showLoading(0);

            var deptNum = data.data;

            $http.get('/courses/' + deptNum + '/' + sem).then(function(data){
                $scope.courses = data.data;
                $scope.showCourses = true;

                if(data.data.length == 0){
                    $scope.coursesMsg = "Couldn't find any course..";
                }else{
                    $scope.coursesMsg = "Update your grades to the following courses:";
                    
                    $scope.updateCourseGrades();
                    console.log($scope.courses);
                }

                hideLoading(0);
            });
        });
    }

    $scope.updateCourseGrades = function(){
        for (let i = 0; i < $scope.user.semesters.length; i++) {
            for (let j = 0; j < $scope.user.semesters[i].courses.length; j++) {
                var course = $scope.user.semesters[i].courses[j];

                for (let c = 0; c < $scope.courses.length; c++) {
                    if($scope.courses[c].courseNum == course.courseNum){
                        $scope.courses[c].grade = parseInt(course.grade);
                        break;
                    } 
                }
            }            
        }
    }

    $scope.removeACourse = function(courseNum){
        var num = courseNum;

        $scope.courses = $scope.courses.filter((course) => {
            return course.courseNum != num;
        });
    }
    
    $scope.saveGrade = function(){
        showLoading(0);
        for (let index = 0; index < $scope.courses.length; index++) {
            var course = $scope.courses[index]; 
            var grade = course.grade;
            var semester = course.semester;
            var courseNum = course.courseNum;

            var found = false;
            if(grade != undefined){
                for (let i = 0; i < $scope.user.semesters.length; i++) {
                    const sem = $scope.user.semesters[i];
                    
                    if(semester != sem.semester)
                        continue;
                    
                    for (let j = 0; j < sem.courses.length; j++) {
                        const course = sem.courses[j];

                        if(courseNum == course.courseNum){
                            course.grade = grade;
                            found = true;

                            break;
                        }
                    }

                    if(found)
                        break;

                    else{
                        sem.courses.push({
                            "courseNum": courseNum,
                            "grade": grade
                        });

                        found = true;
                    }
                }

                if(!found){
                    $scope.user.semesters.push({
                        "semester": semester,
                        "courses": [
                            {
                                "courseNum": courseNum,
                                "grade": grade
                            }
                        ]
                    });
                }
            }
        }

        $scope.AVGcalculate();
        $scope.skillsCalculate();

        $http.put('/users/' + $scope.user.username + '/' + JSON.stringify($scope.user.semesters) + '/' + $scope.user.gpa).then(function(data){
            hideLoading(0);
        });
    }

    $scope.AVGcalculate = function(){
        var totalCredit = 0;
        var totalGrade = 0;

        for (let i = 0; i < $scope.user.semesters.length; i++) {
            var semester = $scope.user.semesters[i];
            for (let j = 0; j < semester.courses.length; j++) {
               var course = semester.courses[j];
               var courseNum = course.courseNum;
               var courseGrade = course.grade;

               for (let k = 0; k < $scope.courses.length; k++) {
                   var _c = $scope.courses[k];

                   if(_c.courseNum == courseNum){
                       totalCredit += parseFloat(_c.nkz);
                       totalGrade += parseInt(courseGrade)*parseFloat(_c.nkz);
                       
                       break;
                   }
                   
               }
                
            }
            
        }

        var newGPA = parseFloat(totalGrade/totalCredit);
        console.log(newGPA);

        $scope.user.gpa = newGPA;
    }

    $scope.skillsCalculate = function(){
        var user = $scope.user;
        var courses = $scope.courses;

        var theoryPts = 0;
        var applyPts = 0;
        var mathPts = 0;
        var progPts = 0;

        var theoryGrd = 0;
        var applyGrd = 0;
        var mathGrd = 0;
        var progGrd = 0;
        
        
        for (var sem=0; sem<user.semesters.length; sem++)
          {
            for (var crs=0; crs<user.semesters[sem].courses.length; crs++)
            {    
              var cnum = user.semesters[sem].courses[crs].courseNum;
              var grd = user.semesters[sem].courses[crs].grade;
              for (var j=0; j<courses.length; j++)
              {
                if (courses[j].courseNum == cnum)
                {
                  theoryPts += parseFloat(courses[j].skills.theory);
                  applyPts += parseFloat(courses[j].skills.apply);
                  mathPts += parseFloat(courses[j].skills.math);
                  progPts += parseFloat(courses[j].skills.program);
                  theoryGrd += parseFloat(courses[j].skills.theory)*grd;
                  applyGrd += parseFloat(courses[j].skills.apply)*grd;
                  mathGrd += parseFloat(courses[j].skills.math)*grd;
                  progGrd += parseFloat(courses[j].skills.program)*grd;
                  break;
                }    
              }
            }
          }
        theory = Math.round(theoryGrd/theoryPts * 100) / 100;
        apply = Math.round(applyGrd/applyPts * 100) / 100;
        math =  Math.round(mathGrd/mathPts * 100) / 100;
        prog =  Math.round(progGrd/progPts * 100) / 100;
        console.log("theory " + theory);
        console.log("apply " + apply);
        console.log("math " + math);
        console.log("prog " + prog);
    }

}]);
