import React from 'react'
import Content from '../components/content'

class Main extends React.Component {
    componentDidMount () {
        const loading = document.getElementById('loading')
        loading.style.display = 'none'
    }

    render () {
        return (
            <div className='container-fluid' >
                <div className='row main clearfix'>
                    <Content />
                </div>
            </div>
        )
    }
}

export default Main
