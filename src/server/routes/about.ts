import * as path from "path";

var express = require('express');
var router = express.Router();

router.get('/about',  (req, res) => {
    console.log('sending about');
   // res.sendFile('/dist/about.html');
    res.status(201).json({ message: "Hello World!" });
})

export {router as aboutRouter}
