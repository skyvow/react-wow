import React from 'react'
import ReactDom from 'react-dom'
import { node, oneOfType, string, bool, number, arrayOf, func } from 'prop-types'
import { on, off } from './utils/event'
import splice from './utils/splice'
import trim from './utils/trim'
import scrollParent from './utils/scrollParent'

const LISTEN_FLAG = 'data-react-wow'
const defaultBoundingClientRect = { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }
const caches = { listeners: [], pending: [] }

// try to handle passive events
let passiveEventSupported = false
try {
    const opts = Object.defineProperty({}, 'passive', {
        get () {
            passiveEventSupported = true
        },
    })
    window.addEventListener('test', null, opts)
} catch (e) { }
// if they are supported, setup the optional params
// IMPORTANT: FALSE doubles as the default CAPTURE value!
const passiveEvent = passiveEventSupported ? { capture: false, passive: true } : false

/**
 * Check if `component` is visible in overflow container `parent`
 * @param  {node} component React component
 * @param  {node} parent    component's scroll parent
 * @return {bool}
 */
const checkOverflowVisible = (component, parent) => {
    const node = ReactDom.findDOMNode(component)

    let parentTop
    let parentHeight

    try {
        ({ top: parentTop, height: parentHeight } = parent.getBoundingClientRect())
    } catch (e) {
        ({ top: parentTop, height: parentHeight } = defaultBoundingClientRect)
    }

    const windowInnerHeight = window.innerHeight || document.documentElement.clientHeight

    // calculate top and height of the intersection of the element's scrollParent and viewport
    const intersectionTop = Math.max(parentTop, 0) // intersection's top relative to viewport
    const intersectionHeight = Math.min(windowInnerHeight, parentTop + parentHeight) - intersectionTop // height

    // check whether the element is visible in the intersection
    let top
    let height

    try {
        ({ top, height } = node.getBoundingClientRect())
    } catch (e) {
        ({ top, height } = defaultBoundingClientRect)
    }

    const offsetTop = top - intersectionTop // element's top relative to intersection

    const offsets = Array.isArray(component.props.offset) ? component.props.offset : [component.props.offset, component.props.offset] // Be compatible with previous API

    return (offsetTop - offsets[0] <= intersectionHeight) && (offsetTop + height + offsets[1] >= 0)
}

/**
 * Check if `component` is visible in document
 * @param  {node} component React component
 * @return {bool}
 */
const checkNormalVisible = (component) => {
    const node = ReactDom.findDOMNode(component)

    // If this element is hidden by css rules somehow, it's definitely invisible
    if (!(node.offsetWidth || node.offsetHeight || node.getClientRects().length)) return false

    let top
    let elementHeight

    try {
        ({ top, height: elementHeight } = node.getBoundingClientRect())
    } catch (e) {
        ({ top, height: elementHeight } = defaultBoundingClientRect)
    }

    const windowInnerHeight = window.innerHeight || document.documentElement.clientHeight

    const offsets = Array.isArray(component.props.offset) ? component.props.offset : [component.props.offset, component.props.offset] // Be compatible with previous API

    return (top - offsets[0] <= windowInnerHeight) && (top + elementHeight + offsets[1] >= 0)
}

/**
 * Detect if element is visible in viewport, if so, set `visible` state to true.
 * If `once` prop is provided true, remove component as listener after checkVisible
 *
 * @param  {React} component   React component that respond to scroll and resize
 */
const checkVisible = (component) => {
    const node = ReactDom.findDOMNode(component)
    if (!node) {
        return
    }
    const parent = scrollParent(node)
    const isOverflow = component.props.overflow && parent !== node.ownerDocument && parent !== document && parent !== document.documentElement
    const visible = isOverflow ? checkOverflowVisible(component, parent) : checkNormalVisible(component)
    if (visible) {
        if (!component.visible) {
            caches.pending.push(component)

            component.visible = true
            component.setState({
                stopped: false,
            })
            component.forceUpdate()
        }
    }
}
const purgePending = () => {
    caches.pending.forEach((component) => splice(caches.listeners, component))
    caches.pending = []
}
const scrollHandler = () => {
    caches.listeners.forEach((component) => checkVisible(component))

    // Remove `once` component in listeners
    purgePending()
}

class ReactWOW extends React.Component {
    constructor (props) {
        super(props)
        this.visible = false
        this.state = {
            stopped: false,
        }
    }

    componentDidMount () {
        if (this.props.disabled) {
            return false
        }

        if (this.props.overflow) {
            const parent = scrollParent(ReactDom.findDOMNode(this))
            if (parent && typeof parent.getAttribute === 'function') {
                const listenerCount = 1 + (+parent.getAttribute(LISTEN_FLAG))
                if (listenerCount === 1) {
                    on(parent, 'scroll', scrollHandler, passiveEvent)
                }
                parent.setAttribute(LISTEN_FLAG, listenerCount)
            }
        } else if (!caches.listeners.length) {
            const { scroll, resize } = this.props

            if (scroll) {
                on(window, 'scroll', scrollHandler, passiveEvent)
            }

            if (resize) {
                on(window, 'resize', scrollHandler, passiveEvent)
            }
        }

        caches.listeners.push(this)
        checkVisible(this)
    }

    shouldComponentUpdate () {
        return this.visible
    }

    componentWillUnmount () {
        if (this.props.disabled) {
            return false
        }

        if (this.props.overflow) {
            const parent = scrollParent(ReactDom.findDOMNode(this))
            if (parent && typeof parent.getAttribute === 'function') {
                const listenerCount = (+parent.getAttribute(LISTEN_FLAG)) - 1
                if (listenerCount === 0) {
                    off(parent, 'scroll', scrollHandler, passiveEvent)
                    parent.removeAttribute(LISTEN_FLAG)
                } else {
                    parent.setAttribute(LISTEN_FLAG, listenerCount)
                }
            }
        }

        splice(caches.listeners, this)

        if (!caches.listeners.length) {
            off(window, 'scroll', scrollHandler, passiveEvent)
            off(window, 'resize', scrollHandler, passiveEvent)
        }
    }

    /**
     * Custom style
     * @param  {boolean} hidden
     */
    customStyle = (hidden) => {
        const { duration, delay, iteration, animation, disabled } = this.props
        const style = {
            animationName: hidden ? 'none' : animation,
            visibility: hidden && !disabled ? 'hidden' : 'visible',
        }

        if (duration) {
            style.animationDuration = duration
        }

        if (delay) {
            style.animationDelay = delay
        }

        if (iteration) {
            style.animationIterationCount = iteration
        }

        return style
    }

    /**
     * Reset animation
     * @param  {object} e
     */
    resetAnimation = (e) => {
        if (e.type.toLowerCase().indexOf('animationend') !== -1) {
            this.setState({
                stopped: true,
            }, () => {
                const { callback } = this.props

                if (typeof callback === 'function') {
                    callback.call(this, ReactDom.findDOMNode(this))
                }
            })
        }
    }

    /**
     * Merge props
     * @param  {object} props
     */
    mergeProps (props) {
        const { animation, animateClass } = this.props
        const style = this.customStyle(!this.visible)
        const className = this.visible ? `${animation} ${!this.state.stopped ? animateClass : ''}` : animation

        return {
            ...props,
            style: {
                ...props.style,
                ...style,
            },
            className: trim(`${props.className ? props.className : ''} ${className}`),
            onAnimationEnd: this.resetAnimation,
        }
    }

    render () {
        const { children, disabled } = this.props

        return disabled ? children : children ? React.Children.map(children, (child) => React.cloneElement(child, this.mergeProps(child.props))) : null
    }
}

ReactWOW.propTypes = {
    duration: string,
    delay: string,
    iteration: string,
    animation: string,
    children: node,
    scroll: bool,
    resize: bool,
    animateClass: string,
    offset: oneOfType([number, arrayOf(number)]),
    overflow: bool,
    callback: func,
}

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
    callback: () => {}, // The callback is fired every time an animation is stoped
}

export default ReactWOW
