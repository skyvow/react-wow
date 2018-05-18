import React from 'react'

export default class Test extends React.Component {
    constructor() {
        super()
        this.state = {
            timestamp: Date.now(),
        }
    }

    componentWillReceiveProps() {
        this.setState({
            timestamp: Date.now(),
        })
    }

    render() {
        const { timestamp } = this.state
        const { height, style, className } = this.props

        return (
            <div style={{ height, ...style }} className={className}>
                <span>ReactWOW {timestamp}</span>
                {this.props.children}
            </div>
        )
    }
}

Test.defaultProps = {
    height: 200,
    className: 'react-wow',
}
