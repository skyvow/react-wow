"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var on = exports.on = function on(el, eventName, callback) {
    var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (el.addEventListener) {
        el.addEventListener(eventName, callback, opts);
    } else if (el.attachEvent) {
        el.attachEvent("on" + eventName, function (e) {
            callback.call(el, e || window.event);
        });
    }
};

var off = exports.off = function off(el, eventName, callback) {
    var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (el.removeEventListener) {
        el.removeEventListener(eventName, callback, opts);
    } else if (el.detachEvent) {
        el.detachEvent("on" + eventName, callback);
    }
};