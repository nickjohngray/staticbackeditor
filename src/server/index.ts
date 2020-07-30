import express from 'express'
import bodyParser from 'body-parser'
import {indexRouter} from "./routes"
import {commitRouter} from "./routes/commit"
import {cloneRepoRouter} from "./routes/clone-repo"
import {pushToMasterRouter} from "./routes/push-to-master"
import * as path from "path";
import {loginRouter} from "./routes/login"
import os from 'os'
import mongodb from 'mongodb'
import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware';
import {saveManifest} from "./routes/save-manifest";

const app = express()
const port = 8050;

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('dist'))
app.use(indexRouter)

var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('App is running');
    next(); // make sure we go to the next routes and don't stop here
});

router.route('/test')
    .get(function (req, res) {
        res.json({username: os.userInfo().username})
    })
    .post(bodyParser.json(), function (req, res) {
        res.json(req.body);

    })
    .put(bodyParser.json(), function (req, res) {
        res.json(req.body);
    })
    .delete(bodyParser.json(), function (req, res) {
        res.json(req.body);
    });

/*app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next()
});*/

app.use('/api', router)
const API = '/api';
app.use(API, commitRouter)
app.use(API, cloneRepoRouter)
app.use(API, pushToMasterRouter)
app.use(API, loginRouter)
app.use(API, saveManifest)
app.use(API, (req, res) => {
});


app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`)
})


// Callback function for checking connecting or error
app.on("error", err => {
    return console.error(err);
});


