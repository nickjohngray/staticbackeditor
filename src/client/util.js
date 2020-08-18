'use strict'
exports.__esModule = true
exports.fieldsOk = void 0
exports.fieldsOk = function () {
    var fields = []
    for (var _i = 0; _i < arguments.length; _i++) {
        fields[_i] = arguments[_i]
    }
    var ok = fields.every(function (field) {
        return field !== ''
    })
    console.log('ok=' + ok)
    return ok
}
