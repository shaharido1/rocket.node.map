var express = require('express')
var app = express()

app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.post('/', function (req, res) {
    res.send('in post');
    console.log("in post")
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});