var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var md5 = require('md5');

var app = express();
const port = 8080;
app.set('port', (process.env.PORT || port));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

const mlabUrl = "https://api.mlab.com/api/1/databases/gradeanalytica/collections/";
const apiKey = "?apiKey=z-so78xt43eKPEx8v5ZiHFmL8aRK82u_"; 

//Courses mapping
var departments = {
    "Software and Information Systems Engineering": "372"
};

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/departments/:name', function(req,res){
    var deptName = req.params.name;

    var deptNum = DeptartmentNameToNum(deptName);

    res.send(deptNum);
});

app.get('/users/:user', function(req,res){
    var user = req.params.user;

    async function fetchUser(u){
        var _user = await getAUser(u);
        res.send(_user);
    }

    fetchUser(user);
});

function getAUser(user){
    return new Promise((resolve,reject) => {
        const query = `&q={"username":"${user}"}`;
        const url = mlabUrl + "Users" + apiKey + query; 
        request(url, function (error, response, body) {
            if(error) {
                console.log("err");
                reject(error);
                return [];

            }else{
                var user = JSON.parse(body);

                resolve(user[0]);
            }
        });
    });
}

app.put('/users/:username/:data/:gpa', function(req,res){
    var user = req.params.username;
    var data = req.params.data;
    var gpa = req.params.gpa;

    async function updateAUser(u,d,gpa){
        var rspns = await updateUser(u,d,gpa);
        res.send(rspns);
    }

    updateAUser(user, data, gpa);
});

function updateUser(user, data, gpa){
    return new Promise((resolve,reject) => {
        const query = `&q={"username":"${user}"}`;
        const url = mlabUrl + "Users" + apiKey + query; 

        request({ url: url, method: 'PUT', json: { "$set" :{"semesters":data, "gpa":gpa}}}, function (error, response, body) {
            if(error) {
                console.log("err");
                reject(error);
                return [];

            }else{
                var rsp = body;
                resolve(rsp);
            }
        });

    });
}


//Instead of connection the DB
function DeptartmentNameToNum(name){
    return departments[name];
}

app.get('/courses/:dept/:semester', function(req,res){
    var deptNum = req.params.dept;
    var semester = req.params.semester;

    async function fetchCourses(s){
        var _courses = await getCourses(s);

        res.send(_courses);
    }

    fetchCourses(semester);

});

function getCourses(semester){
    return new Promise((resolve,reject) => {
        const order = '&s={"semester": -1}';
        const url = mlabUrl + "Courses" + apiKey + order; 
        request(url, function (error, response, body) {
            if(error) {
                console.log("err");
                reject(error);
                return [];

            }else{
                var c = JSON.parse(body);
                // console.log(user);
                var filteredCourses = c.filter(function(course){
                    return (parseInt(course.semester) < semester);
                });
                
                resolve(filteredCourses);
            }
        });
    });
}

/*
//Initial Courses loading to DB
var coursesToLoad = 
[
    {
        "courseNum":"372.1.2402",
        "semester": "6",
        "courseName": "Internet Programming Environments",
        "nkz": "3.0",
        "skills":
        {
            "theory": "4",
            "apply": "4",
            "math": "0",
            "program": "5"
        }
    },
    
    {
        "courseNum":"372.1.2801",
        "semester": "6",
        "courseName": "Human Computer Interface",
        "nkz": "3.0",
        "skills":
        {
            "theory": "5",
            "apply": "2",
            "math": "0",
            "program": "0"
        }
    },
    
    {
        "courseNum":"372.1.3103",
        "semester": "6",
        "courseName": "Object Oriented Analysis and Design",
        "nkz": "3.5",
        "skills":
        {
            "theory": "4",
            "apply": "4",
            "math": "0",
            "program": "4"
        }
    },

    {
        "courseNum":"372.1.3105",
        "semester": "6",
        "courseName": "Data Mining and Data Warehousing",
        "nkz": "4.0",
        "skills":
        {
            "theory": "5",
            "apply": "4",
            "math": "2",
            "program": "4"
        }
    },
    
    {
        "courseNum":"372.1.4003",
        "semester": "6",
        "courseName": "Preparation for final project",
        "nkz": "1.0",
        "skills":
        {
            "theory": "4",
            "apply": "5",
            "math": "1",
            "program": "5"
        }	
    },
    
    {
        "courseNum":"681.1.1051",
        "semester": "6",
        "courseName": "Security of Computers and Communication Networks",
        "nkz": "3.5",
        "skills":
        {
            "theory": "5",
            "apply": "4",
            "math": "3",
            "program": "2"
        }
    },
    
    {
        "courseNum":"372.1.3501",
        "semester": "7",
        "courseName": "Software Quality Engineering",
        "nkz": "3.5",
        "skills":
        {
            "theory": "3",
            "apply": "4",
            "math": "1",
            "program": "5"
        }
    },
    
    {
        "courseNum":"372.1.4001",
        "semester": "7",
        "courseName": "Seminar/Final Project 1",
        "nkz": "2.0",
        "skills":
        {
            "theory": "3",
            "apply": "5",
            "math": "1",
            "program": "5"
        }
    },
    
    {
        "courseNum":"372.1.4307",
        "semester": "7",
        "courseName": "Advanced Databases",
        "nkz": "3.5",
        "skills":
        {
            "theory": "5",
            "apply": "4",
            "math": "1",
            "program": "4"
        }
    },
    
    {
        "courseNum":"372.1.4902",
        "semester": "7",
        "courseName": "Analysis and Decision Making in Information Systems",
        "nkz": "3.0",
        "skills":
        {
            "theory": "5",
            "apply": "3",
            "math": "2",
            "program": "3"
        }
    },
    
    {
        "courseNum":"372.1.3031",
        "semester": "8",
        "courseName": "Computer Simulation",
        "nkz": "3.5",
        "skills":
        {
            "theory": "5",
            "apply": "3",
            "math": "2",
            "program": "3"
        }
    },
    
    {
        "courseNum":"372.1.4002",
        "semester": "8",
        "courseName": "Seminar/Final Project 2",
        "nkz": "5.0",
        "skills":
        {
            "theory": "3",
            "apply": "5",
            "math": "1",
            "program": "5"
        }
    },
    
    {
        "courseNum":"372.1.4108",
        "semester": "8",
        "courseName": "Software Project Management",
        "nkz": "3.0",
        "skills":
        {
            "theory": "4",
            "apply": "4",
            "math": "2",
            "program": "5"
        }
    }
];

function loadContent(){
    const url = "https://api.mlab.com/api/1/databases/gradeanalytica/collections/Courses?apiKey=z-so78xt43eKPEx8v5ZiHFmL8aRK82u_"; 

    var options = {
        uri: url,
        method: 'POST',
        json: coursesToLoad
    };

    request(options , function (error, response, body) {
        if(error) {
            reject(error);
            console.log("err");
            return [];

        }else{
            var add_res = body;
            // console.log(add_res);
            console.log(add_res);
        }
    });
}

 loadContent();
*/

app.listen(app.get('port'),function(){
    console.log("listen to " + app.get('port'));
});