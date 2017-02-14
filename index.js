var express = require('express');
var request = require('request');
var bodyParser = require('body-parser')
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.post('/getLocation', function (req, res) {
    credentials = login();
    getUserData(credentials)
});

app.post('/updateLocation', function (req, res) {
    credentials = login();
    updateUserLocation(credentials)
    res.send('in post');
});

function login() {
    var authToken;
    var userId;
    request.post(
        {
            url: "http://localhost:3000/api/v1/login",
            form: {user: "ido@webiks.com", password: "Mangosos1!"}
        },
        function (err, httpResponse, body) {
            authToken = body.data.authToken;
            userId = body.data.userId;
            console.log(body);
            updateUserLocation(authToken, userId)
        });
    return {authToken: authToken, userId: userId}
}

function getUserData(credentials, userId) {
    if (!userId) {userId=credentials.userId}
    request
        .get({
            url: "http://localhost:3000/api/v1/users.info?userId=" + userId,
            headers: {
                "X-Auth-Token": credentials.authToken,
                "X-User-Id": credentials.userId
            }
        }).on('response', function (response) {
            console.log(response.body)
    })
}

function updateUserLocation(credentials, userId) {
    if (!userId) {userId=credentials.userId}
    request.post({
        url: "http://localhost:3000/api/v1/users.update",
        headers: {
            "X-Auth-Token": credentials.authToken,
            "X-User-Id": credentials.userId,
            "Content-type": "application/json"
        },
        form: {userId: userId, data: {customFields: {location: "tel-aviv"}}}
    })
}

app.listen(8000, function () {
    console.log('Example app listening on port 8000!')
});