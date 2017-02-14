var express = require('express');
var request = require('request');
var bodyParser = require('body-parser')
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.post('/', function (req, res) {
    res.send('in post');
    console.log("in post");
    console.log(JSON.stringify(req));
    request.POST(
        {url: "http://localhost:3000/api/v1/login",
         form : {user: "ido@webiks.com", password: "Mangosos1!"}},
         function(err,httpResponse,body){
             console.log(body)
         })
});

app.listen(8000, function () {
    console.log('Example app listening on port 8000!')
});