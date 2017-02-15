
"use strict"

var express = require ('express');
var request = require('request')
var bodyParser = require('body-parser');
var Promise = require ('promise')

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/getLocation', function (req, res) {
    console.log(req.body)
    login().then( function (credentials) {
        console.log(credentials)
        getUserData(credentials);
    })
});

app.post('/updateLocation', function (req, res) {
    console.log("update_location")
    login().then( function (credentials) {
        updateUserLocation(credentials);
        res.send('in post');
    })
});

function login() {
    return new Promise ((resolve, reject) => {
        request.post(
            {
                url: "http://localhost:3000/api/v1/login",
                form: {user: "ido@webiks.com", password: "Mangosos1!"}
            },
            function (err, httpResponse, body) {
                console.log(body);
                var credentials = {
                    authToken : "",
                    userId  : ""
                };
                credentials.authToken = body.data.authToken;
                credentials.userId = body.data.userId;
                resolve(credentials)
            });
    })
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