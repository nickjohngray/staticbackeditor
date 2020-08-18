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
exports.pushToMaster = exports.commit = exports.cloneRepo = void 0
var simple_git_1 = require('simple-git')
exports.cloneRepo = function (repoURL) {
    return __awaiter(void 0, void 0, void 0, function () {
        var options, git, e_1
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3])
                    options = {
                        baseDir: process.cwd(),
                        binary: 'git',
                        maxConcurrentProcesses: 6
                    }
                    git = simple_git_1['default'](options)
                    return [4 /*yield*/, git.clone(repoURL)]
                case 1:
                    _a.sent()
                    return [3 /*break*/, 3]
                case 2:
                    e_1 = _a.sent()
                    console.log('error====' + e_1)
                    throw e_1
                case 3:
                    return [2 /*return*/]
            }
        })
    })
}
exports.commit = function (repoName, message) {
    var fileNames = []
    for (var _i = 2; _i < arguments.length; _i++) {
        fileNames[_i - 2] = arguments[_i]
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var options, git, e_2
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4])
                    options = {
                        baseDir: process.cwd() + '/' + repoName,
                        binary: 'git',
                        maxConcurrentProcesses: 6
                    }
                    git = simple_git_1['default'](options)
                    return [4 /*yield*/, git.add(fileNames)]
                case 1:
                    _a.sent()
                    return [4 /*yield*/, git.commit(message)]
                case 2:
                    _a.sent()
                    return [3 /*break*/, 4]
                case 3:
                    e_2 = _a.sent()
                    console.log('error====' + e_2)
                    throw e_2
                case 4:
                    return [2 /*return*/]
            }
        })
    })
}
exports.pushToMaster = function (repoName) {
    return __awaiter(void 0, void 0, void 0, function () {
        var options, git, e_3
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3])
                    options = {
                        baseDir: process.cwd() + '/' + repoName,
                        binary: 'git',
                        maxConcurrentProcesses: 6
                    }
                    git = simple_git_1['default'](options)
                    return [4 /*yield*/, git.push('origin', 'master')]
                case 1:
                    _a.sent()
                    return [3 /*break*/, 3]
                case 2:
                    e_3 = _a.sent()
                    console.log('error====' + e_3)
                    throw e_3
                case 3:
                    return [2 /*return*/]
            }
        })
    })
}
