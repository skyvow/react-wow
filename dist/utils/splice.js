"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var item = arguments[1];

    var index = arr.indexOf(item);

    if (index !== -1) {
        arr.splice(index, 1);
    }
};