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

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(app.get('port'),function(){
    console.log("listen to " + app.get('port'));
});