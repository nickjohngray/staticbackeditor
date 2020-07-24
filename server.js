const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();

console.log('May Node be with you')

app.use(bodyParser.urlencoded({extend: true}));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/' + 'index.html');
});

app.listen(3000, function () {
    console.log('listening on 3000');
});

app.post('/quotes', (req, res) => {
    console.log(req.body.name);
});

