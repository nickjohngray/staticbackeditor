"use strict";
exports.__esModule = true;
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var routes_1 = require("./routes");
var commit_1 = require("./routes/commit");
var clone_repo_1 = require("./routes/clone-repo");
var push_to_master_1 = require("./routes/push-to-master");
var login_1 = require("./routes/login");
var os_1 = require("os");
var mongodb_1 = require("mongodb");
var MongoClient = mongodb_1["default"].MongoClient;
var app = express_1["default"]();
var port = 8050;
app.use(body_parser_1["default"].urlencoded({ extended: true }));
app.use(body_parser_1["default"].json());
app.use(express_1["default"].static('dist'));
app.use(routes_1.indexRouter);
var router = express_1["default"].Router(); // get an instance of the express Router
// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('App is running');
    next(); // make sure we go to the next routes and don't stop here
});
router.route('/test')
    .get(function (req, res) {
    res.json({ username: os_1["default"].userInfo().username });
})
    .post(body_parser_1["default"].json(), function (req, res) {
    res.json(req.body);
})
    .put(body_parser_1["default"].json(), function (req, res) {
    res.json(req.body);
})["delete"](body_parser_1["default"].json(), function (req, res) {
    res.json(req.body);
});
/*app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next()
});*/
/*app.use('/api',
    createProxyMiddleware({ target: 'localhost:8050', changeOrigin: true })

);*/
// http://localhost:3000/api/foo/bar -> http://www.example.org/api/foo/bar
app.use('/api', router);
var API = '/api';
app.use(API, commit_1.commitRouter);
app.use(API, clone_repo_1.cloneRepoRouter);
app.use(API, push_to_master_1.pushToMasterRouter);
app.use(API, login_1.loginRouter);
app.use(API, function (req, res) {
});
app.listen(port, function (err) {
    if (err) {
        return console.error(err);
    }
    return console.log("server is listening on " + port);
});
// Callback function for checking connecting or error
app.on("error", function (err) {
    return console.error(err);
});
