'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var arr = str.trim().split(' ');

    return arr.filter(function (n, i) {
        return !!n && arr.indexOf(n) === i;
    }).join(' ');
};