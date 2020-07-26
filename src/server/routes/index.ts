import * as path from "path";

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    console.log('sending index.html');
    res.sendFile('/dist/index.html');
})

export {router as indexRouter}
