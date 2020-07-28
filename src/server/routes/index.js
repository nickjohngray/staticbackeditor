"use strict";
exports.__esModule = true;
exports.indexRouter = void 0;
var express = require('express');
var router = express.Router();
exports.indexRouter = router;
router.get('/', function (req, res) {
    console.log('sending index.html');
    res.sendFile('/dist/index.html');
});
