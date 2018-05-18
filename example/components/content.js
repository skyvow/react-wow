import React from 'react'
import ReactWOW from '../../src/index'

class Content extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            items: [
                {
                    prop: 'duration',
                    desc: 'Animation duration',
                    type: 'string',
                    value: '-',
                },
                {
                    prop: 'delay',
                    desc: 'Animation delay',
                    type: 'string',
                    value: '-',
                },
                {
                    prop: 'iteration',
                    desc: 'Animation iteration count',
                    type: 'string',
                    value: '-',
                },
                {
                    prop: 'animation',
                    desc: 'Animation name',
                    type: 'string',
                    value: '-',
                },
                {
                    prop: 'scroll',
                    desc: 'Listen and react to scroll event',
                    type: 'boolean',
                    value: 'true',
                },
                {
                    prop: 'resize',
                    desc: 'Listen and react to resize event',
                    type: 'boolean',
                    value: 'true',
                },
                {
                    prop: 'animateClass',
                    desc: 'Animation css class',
                    type: 'string',
                    value: 'animated',
                },
                {
                    prop: 'offset',
                    desc: 'Distance to the element when triggering the animation',
                    type: 'number|array',
                    value: '0',
                },
                {
                    prop: 'overflow',
                    desc: 'If your components inside a overflow container, set this to true',
                    type: 'boolean',
                    value: 'false',
                },
                {
                    prop: 'disabled',
                    desc: 'Disable the animation',
                    type: 'boolean',
                    value: 'false',
                },
                {
                    prop: 'callback',
                    desc: 'The callback is fired every time an animation is stoped',
                    type: 'function',
                    value: '-',
                },
            ],
        }
    }

    onClick = () => {
        window.location.reload()
    }

    render () {
        const { items } = this.state

        return (
            <section className='col-md-8 col-md-offset-2 card-wrapper'>
                <div className='card background-card'>
                    <button type='button' className='btn btn-default btn-refresh' onClick={this.onClick}>Refresh</button>
                    <h4>Exmaple</h4>
                    <hr />
                    <section className='mb-50'>
                        <h5 className='box-title'>Normal</h5>
                        <div className='container-white'>
                            <div className='circles'>
                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <ReactWOW delay='0.5s' animation='rollIn'>
                                            <p className='circle bg-green'>
                                                such easy
                                            </p>
                                        </ReactWOW>
                                    </div>
                                    <div className='col-sm-4 text-center'>
                                        <ReactWOW delay='0.5s' animation='bounceInDown'>
                                            <img src='assets/images/wow-1.gif' className='wow-image' />
                                        </ReactWOW>
                                    </div>
                                    <div className='col-sm-4'>
                                        <ReactWOW delay='0.5s' animation='lightSpeedIn'>
                                            <p className='circle bg-yellow'>
                                                very JS
                                            </p>
                                        </ReactWOW>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-4 text-center'>
                                        <ReactWOW animation='rollIn'>
                                            <img src='assets/images/wow-3.gif' className='wow-image' />
                                        </ReactWOW>
                                    </div>
                                    <div className='col-sm-4'>
                                        <ReactWOW iteration='5' duration='0.15s' animation='pulse'>
                                            <p className='circle bg-blue'>
                                                React-WOW
                                            </p>
                                        </ReactWOW>
                                    </div>
                                    <div className='col-sm-4 text-center'>
                                        <ReactWOW animation='bounceInRight'>
                                            <img src='assets/images/wow-12.gif' className='wow-image' />
                                        </ReactWOW>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <ReactWOW animation='bounceInLeft'>
                                            <p className='circle bg-red'>
                                                react
                                            </p>
                                        </ReactWOW>
                                    </div>
                                    <div className='col-sm-4 text-center'>
                                        <ReactWOW animation='flipInX'>
                                            <img src='assets/images/wow-2.gif' className='wow-image' />
                                        </ReactWOW>
                                    </div>
                                    <div className='col-sm-4'>
                                        <ReactWOW animation='bounceInRight'>
                                            <p className='circle bg-purple'>
                                                many anims
                                            </p>
                                        </ReactWOW>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h5 className='box-title'>Using offset</h5>
                        <div className='container-white'>
                            <div className='row'>
                                <div className='col-sm-4 text-center'>
                                    <ReactWOW offset={50} animation='rollIn'>
                                        <img src='assets/images/wow-5.gif' className='wow-image' />
                                    </ReactWOW>
                                </div>
                                <div className='col-sm-4'>
                                    <ReactWOW offset={50} iteration='5' duration='0.15s' animation='shake'>
                                        <p className='circle bg-yellow'>
                                            aint joke
                                        </p>
                                    </ReactWOW>
                                </div>
                                <div className='col-sm-4 text-center'>
                                    <ReactWOW offset={50} iteration='2' animation='swing'>
                                        <img src='assets/images/wow-6.gif' className='wow-image' />
                                    </ReactWOW>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-sm-4'>
                                    <ReactWOW offset={50} animation='rollIn'>
                                        <p className='circle bg-purple'>
                                            how small
                                        </p>
                                    </ReactWOW>
                                </div>
                                <div className='col-sm-4 text-center'>
                                    <ReactWOW offset={50} delay='0.5s' animation='bounceInUp'>
                                        <img src='assets/images/wow-10.gif' className='wow-image' />
                                    </ReactWOW>
                                </div>
                                <div className='col-sm-4'>
                                    <ReactWOW offset={50} delay='0.5s' duration='0.15s' animation='lightSpeedIn'>
                                        <p className='circle bg-green'>
                                            3 kb only
                                        </p>
                                    </ReactWOW>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-sm-4 text-center'>
                                    <ReactWOW offset={50} animation='rollIn'>
                                        <img src='assets/images/wow-7.gif' className='wow-image' />
                                    </ReactWOW>
                                </div>
                                <div className='col-sm-4'>
                                    <ReactWOW offset={50} iteration='5' duration='0.25s' animation='pulse'>
                                        <p className='circle bg-blue'>
                                            just scroll
                                        </p>
                                    </ReactWOW>
                                </div>
                                <div className='col-sm-4 text-center'>
                                    <ReactWOW offset={50} animation='lightSpeedIn'>
                                        <img src='assets/images/wow-9.gif' className='wow-image' />
                                    </ReactWOW>
                                </div>
                            </div>
                        </div>
                        <h5 className='box-title'>Using inside overflow container</h5>
                        <div className='container-white overflow'>
                            <div className='row'>
                                <div className='col-sm-4'>
                                    <ReactWOW overflow={true} iteration='5' duration='0.15s' animation='bounce'>
                                        <p className='circle bg-yellow'>
                                            reveal now
                                        </p>
                                    </ReactWOW>
                                </div>
                                <div className='col-sm-4 text-center'>
                                    <ReactWOW overflow={true} animation='bounceInUp'>
                                        <img src='assets/images/wow-8.gif' className='wow-image' />
                                    </ReactWOW>
                                </div>
                                <div className='col-sm-4'>
                                    <ReactWOW overflow={true} animation='bounceInRight'>
                                        <p className='circle bg-red'>
                                            so impress
                                        </p>
                                    </ReactWOW>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-sm-4 text-center'>
                                    <ReactWOW overflow={true} animation='rollIn'>
                                        <img src='assets/images/wow-4.gif' className='wow-image' />
                                    </ReactWOW>
                                </div>
                                <div className='col-sm-4'>
                                    <ReactWOW overflow={true} iteration='5' duration='0.15s' animation='flip'>
                                        <p className='circle bg-green'>
                                            React-WOW
                                        </p>
                                    </ReactWOW>
                                </div>
                                <div className='col-sm-4 text-center'>
                                    <ReactWOW overflow={true} animation='bounceInRight'>
                                        <img src='assets/images/wow-11.gif' className='wow-image' />
                                    </ReactWOW>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-sm-4'>
                                    <ReactWOW overflow={true} delay='0.5s' animation='rollIn'>
                                        <p className='circle bg-red'>
                                            react!
                                        </p>
                                    </ReactWOW>
                                </div>
                                <div className='col-sm-4 text-center'>
                                    <ReactWOW overflow={true} delay='1s' animation='bounceInDown'>
                                        <img src='assets/images/grumpy.gif' className='wow-image' />
                                    </ReactWOW>
                                </div>
                                <div className='col-sm-4'>
                                    <ReactWOW overflow={true} delay='1.5s' animation='bounceInRight'>
                                        <p className='circle bg-purple'>
                                            that good!
                                        </p>
                                    </ReactWOW>
                                </div>
                            </div>
                        </div>
                    </section>
                    <h4 className='text-uppercase'>API</h4>
                    <hr />
                    <section>
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        属性
                                    </th>
                                    <th>
                                        说明
                                    </th>
                                    <th>
                                        类型
                                    </th>
                                    <th>
                                        默认值
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((n) => {
                                    return (
                                        <tr key={n.prop}>
                                            <td>{n.prop}</td>
                                            <td>{n.desc}</td>
                                            <td>{n.type}</td>
                                            <td>{n.value}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </section>
                </div>
            </section>
        )
    }
}

export default Content
