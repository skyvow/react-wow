'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _event = require('./utils/event');

var _splice = require('./utils/splice');

var _splice2 = _interopRequireDefault(_splice);

var _trim = require('./utils/trim');

var _trim2 = _interopRequireDefault(_trim);

var _scrollParent = require('./utils/scrollParent');

var _scrollParent2 = _interopRequireDefault(_scrollParent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LISTEN_FLAG = 'data-react-wow';
var defaultBoundingClientRect = { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
var caches = { listeners: [], pending: []

    // try to handle passive events
};var passiveEventSupported = false;
try {
    var opts = Object.defineProperty({}, 'passive', {
        get: function get() {
            passiveEventSupported = true;
        }
    });
    window.addEventListener('test', null, opts);
} catch (e) {}
// if they are supported, setup the optional params
// IMPORTANT: FALSE doubles as the default CAPTURE value!
var passiveEvent = passiveEventSupported ? { capture: false, passive: true } : false;

/**
 * Check if `component` is visible in overflow container `parent`
 * @param  {node} component React component
 * @param  {node} parent    component's scroll parent
 * @return {bool}
 */
var checkOverflowVisible = function checkOverflowVisible(component, parent) {
    var node = _reactDom2.default.findDOMNode(component);

    var parentTop = void 0;
    var parentHeight = void 0;

    try {
        var _parent$getBoundingCl = parent.getBoundingClientRect();

        parentTop = _parent$getBoundingCl.top;
        parentHeight = _parent$getBoundingCl.height;
    } catch (e) {
        parentTop = defaultBoundingClientRect.top;
        parentHeight = defaultBoundingClientRect.height;
    }

    var windowInnerHeight = window.innerHeight || document.documentElement.clientHeight;

    // calculate top and height of the intersection of the element's scrollParent and viewport
    var intersectionTop = Math.max(parentTop, 0); // intersection's top relative to viewport
    var intersectionHeight = Math.min(windowInnerHeight, parentTop + parentHeight) - intersectionTop; // height

    // check whether the element is visible in the intersection
    var top = void 0;
    var height = void 0;

    try {
        var _node$getBoundingClie = node.getBoundingClientRect();

        top = _node$getBoundingClie.top;
        height = _node$getBoundingClie.height;
    } catch (e) {
        top = defaultBoundingClientRect.top;
        height = defaultBoundingClientRect.height;
    }

    var offsetTop = top - intersectionTop; // element's top relative to intersection

    var offsets = Array.isArray(component.props.offset) ? component.props.offset : [component.props.offset, component.props.offset]; // Be compatible with previous API

    return offsetTop - offsets[0] <= intersectionHeight && offsetTop + height + offsets[1] >= 0;
};

/**
 * Check if `component` is visible in document
 * @param  {node} component React component
 * @return {bool}
 */
var checkNormalVisible = function checkNormalVisible(component) {
    var node = _reactDom2.default.findDOMNode(component);

    // If this element is hidden by css rules somehow, it's definitely invisible
    if (!(node.offsetWidth || node.offsetHeight || node.getClientRects().length)) return false;

    var top = void 0;
    var elementHeight = void 0;

    try {
        var _node$getBoundingClie2 = node.getBoundingClientRect();

        top = _node$getBoundingClie2.top;
        elementHeight = _node$getBoundingClie2.height;
    } catch (e) {
        top = defaultBoundingClientRect.top;
        elementHeight = defaultBoundingClientRect.height;
    }

    var windowInnerHeight = window.innerHeight || document.documentElement.clientHeight;

    var offsets = Array.isArray(component.props.offset) ? component.props.offset : [component.props.offset, component.props.offset]; // Be compatible with previous API

    return top - offsets[0] <= windowInnerHeight && top + elementHeight + offsets[1] >= 0;
};

/**
 * Detect if element is visible in viewport, if so, set `visible` state to true.
 * If `once` prop is provided true, remove component as listener after checkVisible
 *
 * @param  {React} component   React component that respond to scroll and resize
 */
var checkVisible = function checkVisible(component) {
    var node = _reactDom2.default.findDOMNode(component);
    if (!node) {
        return;
    }
    var parent = (0, _scrollParent2.default)(node);
    var isOverflow = component.props.overflow && parent !== node.ownerDocument && parent !== document && parent !== document.documentElement;
    var visible = isOverflow ? checkOverflowVisible(component, parent) : checkNormalVisible(component);
    if (visible) {
        if (!component.visible) {
            caches.pending.push(component);

            component.visible = true;
            component.setState({
                stopped: false
            });
            component.forceUpdate();
        }
    }
};
var purgePending = function purgePending() {
    caches.pending.forEach(function (component) {
        return (0, _splice2.default)(caches.listeners, component);
    });
    caches.pending = [];
};
var scrollHandler = function scrollHandler() {
    caches.listeners.forEach(function (component) {
        return checkVisible(component);
    });

    // Remove `once` component in listeners
    purgePending();
};

var ReactWOW = function (_React$Component) {
    _inherits(ReactWOW, _React$Component);

    function ReactWOW(props) {
        _classCallCheck(this, ReactWOW);

        var _this = _possibleConstructorReturn(this, (ReactWOW.__proto__ || Object.getPrototypeOf(ReactWOW)).call(this, props));

        _this.customStyle = function (hidden) {
            var _this$props = _this.props,
                duration = _this$props.duration,
                delay = _this$props.delay,
                iteration = _this$props.iteration,
                animation = _this$props.animation,
                disabled = _this$props.disabled;

            var style = {
                animationName: hidden ? 'none' : animation,
                visibility: hidden && !disabled ? 'hidden' : 'visible'
            };

            if (duration) {
                style.animationDuration = duration;
            }

            if (delay) {
                style.animationDelay = delay;
            }

            if (iteration) {
                style.animationIterationCount = iteration;
            }

            return style;
        };

        _this.resetAnimation = function (e) {
            if (e.type.toLowerCase().indexOf('animationend') !== -1) {
                _this.setState({
                    stopped: true
                }, function () {
                    var callback = _this.props.callback;


                    if (typeof callback === 'function') {
                        callback.call(_this, _reactDom2.default.findDOMNode(_this));
                    }
                });
            }
        };

        _this.visible = false;
        _this.state = {
            stopped: false
        };
        return _this;
    }

    _createClass(ReactWOW, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (this.props.disabled) {
                return false;
            }

            if (this.props.overflow) {
                var parent = (0, _scrollParent2.default)(_reactDom2.default.findDOMNode(this));
                if (parent && typeof parent.getAttribute === 'function') {
                    var listenerCount = 1 + +parent.getAttribute(LISTEN_FLAG);
                    if (listenerCount === 1) {
                        (0, _event.on)(parent, 'scroll', scrollHandler, passiveEvent);
                    }
                    parent.setAttribute(LISTEN_FLAG, listenerCount);
                }
            } else if (!caches.listeners.length) {
                var _props = this.props,
                    scroll = _props.scroll,
                    resize = _props.resize;


                if (scroll) {
                    (0, _event.on)(window, 'scroll', scrollHandler, passiveEvent);
                }

                if (resize) {
                    (0, _event.on)(window, 'resize', scrollHandler, passiveEvent);
                }
            }

            caches.listeners.push(this);
            checkVisible(this);
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate() {
            return this.visible;
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.props.disabled) {
                return false;
            }

            if (this.props.overflow) {
                var parent = (0, _scrollParent2.default)(_reactDom2.default.findDOMNode(this));
                if (parent && typeof parent.getAttribute === 'function') {
                    var listenerCount = +parent.getAttribute(LISTEN_FLAG) - 1;
                    if (listenerCount === 0) {
                        (0, _event.off)(parent, 'scroll', scrollHandler, passiveEvent);
                        parent.removeAttribute(LISTEN_FLAG);
                    } else {
                        parent.setAttribute(LISTEN_FLAG, listenerCount);
                    }
                }
            }

            (0, _splice2.default)(caches.listeners, this);

            if (!caches.listeners.length) {
                (0, _event.off)(window, 'scroll', scrollHandler, passiveEvent);
                (0, _event.off)(window, 'resize', scrollHandler, passiveEvent);
            }
        }

        /**
         * Custom style
         * @param  {boolean} hidden
         */


        /**
         * Reset animation
         * @param  {object} e
         */

    }, {
        key: 'mergeProps',


        /**
         * Merge props
         * @param  {object} props
         */
        value: function mergeProps(props) {
            var _props2 = this.props,
                animation = _props2.animation,
                animateClass = _props2.animateClass;

            var style = this.customStyle(!this.visible);
            var className = this.visible ? animation + ' ' + (!this.state.stopped ? animateClass : '') : animation;

            return _extends({}, props, {
                style: _extends({}, props.style, style),
                className: (0, _trim2.default)((props.className ? props.className : '') + ' ' + className),
                onAnimationEnd: this.resetAnimation
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props3 = this.props,
                children = _props3.children,
                disabled = _props3.disabled;


            return disabled ? children : children ? _react2.default.Children.map(children, function (child) {
                return _react2.default.cloneElement(child, _this2.mergeProps(child.props));
            }) : null;
        }
    }]);

    return ReactWOW;
}(_react2.default.Component);

ReactWOW.propTypes = {
    duration: _propTypes.string,
    delay: _propTypes.string,
    iteration: _propTypes.string,
    animation: _propTypes.string,
    children: _propTypes.node,
    scroll: _propTypes.bool,
    resize: _propTypes.bool,
    animateClass: _propTypes.string,
    offset: (0, _propTypes.oneOfType)([_propTypes.number, (0, _propTypes.arrayOf)(_propTypes.number)]),
    overflow: _propTypes.bool,
    callback: _propTypes.func
};

ReactWOW.defaultProps = {
    duration: '', // Animation duration
    delay: '', // Animation delay
    iteration: '', // Animation iteration count
    animation: '', // Animation name
    scroll: true, // Listen and react to scroll event
    resize: true, // Listen and react to resize event
    animateClass: 'animated', // Animation css class
    offset: 0, // Distance to the element when triggering the animation
    overflow: false, // If your components inside a overflow container, set this to true
    disabled: false, // Disable the animation
    callback: function callback() {} // The callback is fired every time an animation is stoped
};

exports.default = ReactWOW;