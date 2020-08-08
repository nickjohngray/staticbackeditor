import express from 'express'
import bodyParser from 'body-parser'
import {indexRouter} from "./routes"
import {commitRouter} from "./routes/commit"
import {cloneRepoRouter} from "./routes/clone-repo"
import {pushToMasterRouter} from "./routes/push-to-master"
import * as path from "path";
import {loginRouter} from "./routes/login"
import os from 'os'
import {saveManifest} from "./routes/save-manifest";
import {testManifest} from "./routes/test_manifest";
import * as fs from "fs";
import {aboutRouter} from "./routes/about";
const app = express()
const port = 8050;

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('dist'))

/*
app.use((request, response) => {
    fs.readFile(path.resolve('dist', 'index.html'),
        (error, file) => {
            if (error) {
                response.status(404).send(error.toString());
            } else {
                response.status(200).send(file.toString());
            }
        });
});*/



const API = '/api';
app.use(API, commitRouter)
app.use(API, cloneRepoRouter)
app.use(API, pushToMasterRouter)
app.use(API, loginRouter)
app.use(API, saveManifest)
app.use(API, testManifest)

app.use(indexRouter)

app.get('*', (req, res) => {
    console.log('sending index.html')
    res.sendFile(path.resolve('dist', 'index.html'))

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


