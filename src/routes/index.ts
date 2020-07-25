import * as path from "path";

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../index.html'))
})

export {router as indexRouter}
