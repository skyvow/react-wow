import React from 'react'
import ReactDOM from 'react-dom'
import { Router, hashHistory } from 'react-router'
import routes from './routes/index'
import './assets/styles/main'

ReactDOM.render(<Router history={hashHistory} routes={routes} />, document.getElementById('app'))
