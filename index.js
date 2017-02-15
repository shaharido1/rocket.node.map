
"use strict"

var express = require('express');
var request = require('request')
var bodyParser = require('body-parser');
var Promise = require('promise')

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const url = process.env.url || "localhost:3000";
//const urlRocketMap = process.env.url || "http://54.202.112.224:3000"
const portRocketMap = process.env.port || 8000
const usernameRocketMap = process.env.username || "ido@webiks.com"
const passwordRocketMap = process.env.password || "123456789"

app.listen(portRocketMap, function () {
    login()
        .then((credentials) => {
            app.set('headers', {
                "X-Auth-Token": credentials.authToken,
                "X-User-Id": credentials.userId
            }
            )
            console.log("app ready on " + portRocketMap)
        }).catch((err) => { console.log("couldn't log in" + err) })
});


function login() {
    console.log("trying to log in")
    return new Promise((resolve, reject) => {
        var options = {
            url: urlRocketMap + "/api/v1/login",
            method: 'POST',
            form: { user: usernameRocketMap, password: passwordRocketMap }
        }
        request(options, function (err, httpResponse, body) {
            var bodyParse = JSON.parse(body)
            console.log("login is " + bodyParse.status)
            console.log("credentials are - userID: " + bodyParse.data.userId + " authToken: " + bodyParse.data.authToken)
            if (bodyParse.status == "error") {
                reject(err)
            }
            else {
                const credentials = {
                    authToken: bodyParse.data.authToken,
                    userId: bodyParse.data.userId
                }
                resolve(credentials)
            }
        });
    })
}

app.get('/', function (req, res) {
    res.send("hello rocket.map.app")
})

app.post('/addNewLocation', function (req, res) {
    console.log("trying to add location")
    const headers = Object.assign({}, req.app.get('headers'), { "Content-type": "application/json" })
    var options = {
        url: urlRocketMap + "/api/v1/users.create",
        method: 'POST',
        headers: headers,
        form: {
            name: "location",
            email: "no2@email.com",
            password: "123456789",
            username: "locaiton2",
            customFields: { "location": "tel-aviv" }
        }

    }
    request(options, function (err, res, body) {
        var bodyParse = JSON.parse(body)
        console.log(bodyParse)
    })
});

app.post('/getLocation', function (req, res) {
    console.log("trying to get user data")
    if (!userId) { userId = credentials.userId }
    var options = {
        url: urlRocketMap + "/api/v1/users.info?userId=" + userId,
        method: 'GET',
        headers: req.app.get('headers')
    }
    request(options, function (err, res, body) {
        var bodyParse = JSON.parse(body)
        console.log(bodyParse)
    })
})

app.post('/updateLocation', function (req, res) {
    var user_id = req.data.user_id
    var text = req.data.text
    var lng = str.substring(17, 25)
    var lat = str.substring(20, 29)
    console.log(text + lng +lat)
    location = "lng=" + lng + "&lat=" + lat
    console.log("update_location")
    const headers = Object.assign({}, req.app.get('headers'), { "Content-type": "application/json" })
    if (!userId) { userId = credentials.userId }
    var options = {
        url: urlRocketMap + "/api/v1/users.update",
        method: 'POST',
        headers: headers,
        form: { userId: user_id, data: { customFields: { twitter: "locati" }, name: location } }
    }
    request(options, function (err, res, body) {
        var bodyParse = JSON.parse(body)
        console.log(bodyParse)
    })
});

app.post('/getAllLocations', function (req, res) {
    var roomId;
    var headers = req.app.get('headers')
    getAllUsers(headers, roomId).then(allusers => {
        getUsersLocation(headers, allusers)
    })
});

function getUsersLocation(headers, allusers) {
    console.log("tyring to get all users locations")
    allusers.forEach((username) => {
        console.log(username)
        var options = {
            url: urlRocketMap + "/api/v1/users.info?username=" + username,
            method: 'GET',
            headers: headers
        }
        request(options, function (err, res, body) {
            var bodyParse = JSON.parse(body)
            console.log(body)
        })
    })
}

function getAllUsers(headers, roomId) {
    console.log("tyring to get all username")
    if (!roomId) { roomId = "GENERAL" }
    var options = {
        url: urlRocketMap + "/api/v1/channels.info?roomId=" + roomId,
        method: 'GET',
        headers: headers
    }
    return new Promise((resolve, reject) => {
        request(options, function (err, res, body) {
            var bodyParse = JSON.parse(body)
            console.log(bodyParse)
            resolve(bodyParse.channel.usernames)
        })
    })
}

