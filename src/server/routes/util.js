'use strict'
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value)
                  })
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value))
                } catch (e) {
                    reject(e)
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value))
                } catch (e) {
                    reject(e)
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next())
        })
    }
var __generator =
    (this && this.__generator) ||
    function (thisArg, body) {
        var _ = {
                label: 0,
                sent: function () {
                    if (t[0] & 1) throw t[1]
                    return t[1]
                },
                trys: [],
                ops: []
            },
            f,
            y,
            t,
            g
        return (
            (g = {next: verb(0), throw: verb(1), return: verb(2)}),
            typeof Symbol === 'function' &&
                (g[Symbol.iterator] = function () {
                    return this
                }),
            g
        )
        function verb(n) {
            return function (v) {
                return step([n, v])
            }
        }
        function step(op) {
            if (f) throw new TypeError('Generator is already executing.')
            while (_)
                try {
                    if (
                        ((f = 1),
                        y &&
                            (t =
                                op[0] & 2
                                    ? y['return']
                                    : op[0]
                                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                                    : y.next) &&
                            !(t = t.call(y, op[1])).done)
                    )
                        return t
                    if (((y = 0), t)) op = [op[0] & 2, t.value]
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op
                            break
                        case 4:
                            _.label++
                            return {value: op[1], done: false}
                        case 5:
                            _.label++
                            y = op[1]
                            op = [0]
                            continue
                        case 7:
                            op = _.ops.pop()
                            _.trys.pop()
                            continue
                        default:
                            if (
                                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                                (op[0] === 6 || op[0] === 2)
                            ) {
                                _ = 0
                                continue
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1]
                                break
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1]
                                t = op
                                break
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2]
                                _.ops.push(op)
                                break
                            }
                            if (t[2]) _.ops.pop()
                            _.trys.pop()
                            continue
                    }
                    op = body.call(thisArg, _)
                } catch (e) {
                    op = [6, e]
                    y = 0
                } finally {
                    f = t = 0
                }
            if (op[0] & 5) throw op[1]
            return {value: op[0] ? op[1] : void 0, done: true}
        }
    }
exports.__esModule = true
exports.startUpPreviewRepo = exports.dumpError = exports.pageTemplate = exports.makePageComponent = exports.makePageComponentIfNotExist = exports.deletePageComponent = exports.getPageComponentName = exports.getPageComponentPath = void 0
var path_1 = require('path')
var fs_1 = require('fs')
var child_process_1 = require('child_process')
exports.getPageComponentPath = function (pageName, repoName) {
    return path_1['default'].resolve(process.cwd(), repoName, 'src', 'components', 'pages', pageName + '.tsx')
}
exports.getPageComponentName = function (template) {
    var pathBits = template.split('/')
    console.log('getPageComponentName=== ' + pathBits[pathBits.length - 1])
    return pathBits[pathBits.length - 1]
}
exports.deletePageComponent = function (pageName, repoName) {
    return __awaiter(void 0, void 0, void 0, function () {
        var pageComponentPath
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pageComponentPath = exports.getPageComponentPath(pageName, repoName)
                    return [4 /*yield*/, fs_1['default'].existsSync(pageComponentPath)]
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 3]
                    return [4 /*yield*/, fs_1['default'].unlinkSync(pageComponentPath)]
                case 2:
                    _a.sent()
                    return [2 /*return*/, true]
                case 3:
                    return [2 /*return*/, false]
            }
        })
    })
}
exports.makePageComponentIfNotExist = function (pageName, repoName) {
    var pageComponentPath = exports.getPageComponentPath(pageName, repoName)
    if (!fs_1['default'].existsSync(pageComponentPath)) {
        // write new page to the current repo pages dir
        console.log('adding ' + pageComponentPath + ' with content: ' + exports.pageTemplate)
        fs_1['default'].writeFileSync(pageComponentPath, exports.pageTemplate)
        return true
    } else {
        console.log(pageComponentPath + ' exists can make')
        return false
    }
}
exports.makePageComponent = function (pageName, repoName, pageContent) {
    return __awaiter(void 0, void 0, void 0, function () {
        var pageComponentPath, error_1
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6])
                    pageComponentPath = exports.getPageComponentPath(pageName, repoName)
                    return [4 /*yield*/, fs_1['default'].existsSync(pageComponentPath)]
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 3]
                    console.log('File Exists removing it. ' + pageComponentPath)
                    return [4 /*yield*/, fs_1['default'].unlinkSync(pageComponentPath)]
                case 2:
                    _a.sent()
                    _a.label = 3
                case 3:
                    return [4 /*yield*/, fs_1['default'].writeFileSync(pageComponentPath, pageContent)]
                case 4:
                    _a.sent()
                    return [2 /*return*/, true]
                case 5:
                    error_1 = _a.sent()
                    throw error_1
                case 6:
                    return [2 /*return*/]
            }
        })
    })
}
var rmdir = function (dir) {
    try {
        var list = fs_1['default'].readdirSync(dir)
        for (var i = 0; i < list.length; i++) {
            var filename = path_1['default'].join(dir, list[i])
            var stat = fs_1['default'].statSync(filename)
            if (filename === '.' || filename === '..') {
                // pass these files
            } else if (stat.isDirectory()) {
                // rmdir recursively
                rmdir(filename)
            } else {
                // rm filename
                fs_1['default'].unlinkSync(filename)
            }
        }
        fs_1['default'].rmdirSync(dir)
        return true
    } catch (e) {
        return e
    }
}
exports.pageTemplate =
    "import React from 'react'\nimport SectionList from 'components/SectionList'\nimport {getPage} from 'components/pages/pageUtil'\n\nexport default () => (\n    <div className={'page center-it '}>\n        <h1>Athletes</h1>\n        <SectionList sections={getPage('athletes').sections} />\n    </div>\n)"
exports.dumpError = function (err) {
    if (typeof err === 'object') {
        if (err.message) {
            console.log('\nMessage: ' + err.message)
        }
        if (err.stack) {
            console.log('\nStacktrace:')
            console.log('====================')
            console.log(err.stack)
        }
    } else {
        console.log('dumpError :: argument is not an object')
    }
}
exports.startUpPreviewRepo = function (repoName) {
    return __awaiter(void 0, void 0, void 0, function () {
        var repoInstallProcess
        return __generator(this, function (_a) {
            try {
                console.log('About to install node modules for: ' + repoName)
                repoInstallProcess = child_process_1['default'].exec('npm run repo-install ' + repoName)
                repoInstallProcess.on('exit', function (code) {
                    var err = code === 0 ? null : new Error('exit code ' + code)
                    if (err) {
                        console.log(
                            'an error occurred while trying to install node_modules for ' +
                                repoName +
                                ' error is ' +
                                err
                        )
                        return
                    }
                    console.log(repoName + ' nodle modules installed, starting up...')
                    var repoStartProcess = child_process_1['default'].exec('npm run repo-start ' + repoName)
                    repoStartProcess.on('exit', function (code2) {
                        var err2 = code2 === 0 ? null : new Error('exit code ' + code)
                        if (err2) {
                            console.log(err2)
                            return
                        }
                        console.log(repoName + ' is no longer running')
                    })
                    // show all console messages from repo start
                    repoStartProcess.stdout.on('data', function (message) {
                        console.log(repoName + '>>>' + message)
                    })
                    repoStartProcess.on('error', function (code2) {
                        console.log('error starting up ' + repoName + 'Error is ' + code2)
                    })
                })
                // listen for errors as they may prevent the exit event from firing
                repoInstallProcess.on('error', function (err) {
                    console.log(err)
                })
            } catch (err) {
                console.error(err)
            }
            return [2 /*return*/]
        })
    })
}
// var childProcess = require('child_process');
/*
export const runScript = (scriptPath, callback) => {

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork(scriptPath);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}*/
/*
// Now we can run a script and invoke a callback when complete, e.g.
runScript('./some-script.js', function (err) {
    if (err) throw err;
    console.log('finished running some-script.js');
});*/
