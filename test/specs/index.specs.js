import React from 'react'
import ReactDOM from 'react-dom'
import { expect } from 'chai'
import ReactWOW from '../../src/index'
import Test from '../Test.component'

describe('<ReactWOW />', () => {
    let div

    before(() => {
        document.body.style.margin = 0
        document.body.style.padding = 0
    })

    beforeEach(() => {
        div = document.createElement('div')
        document.body.appendChild(div)
    })

    afterEach(() => {
        ReactDOM.unmountComponentAtNode(div)
        div.parentNode.removeChild(div)
        window.scrollTo(0, 0)
    })

    describe('<ReactWOW /> render children', () => {
        it('should render null', () => {
            ReactDOM.render(<ReactWOW />, div)
            expect(document.querySelector('fadeIn')).to.not.exist
        })

        it('should render children when `animation`', () => {
            ReactDOM.render(<ReactWOW animation='fadeIn'><Test /></ReactWOW>, div)
            expect(document.querySelector('.react-wow.fadeIn')).to.exist
        })

        it('should render children when `disabled`', () => {
            ReactDOM.render(<ReactWOW disabled animation='fadeIn'><Test /></ReactWOW>, div)
            expect(document.querySelector('.react-wow')).to.exist
            expect(document.querySelector('.react-wow.fadeIn')).to.not.exist
            expect(document.querySelector('.fadeIn')).to.not.exist
        })

        it('should render children when `duration`', () => {
            ReactDOM.render(<ReactWOW duration='0.3s' animation='fadeIn'><Test /></ReactWOW>, div)
            expect(document.querySelector('.react-wow.fadeIn')).to.exist
            expect(document.querySelector('.react-wow.fadeIn').style.animationDuration).to.equal('0.3s')
        })

        it('should render children when `delay`', () => {
            ReactDOM.render(<ReactWOW delay='0.3s' animation='fadeIn'><Test /></ReactWOW>, div)
            expect(document.querySelector('.react-wow.fadeIn')).to.exist
            expect(document.querySelector('.react-wow.fadeIn').style.animationDelay).to.equal('0.3s')
        })

        it('should render children when `iteration`', () => {
            ReactDOM.render(<ReactWOW iteration='1' animation='fadeIn'><Test /></ReactWOW>, div)
            expect(document.querySelector('.react-wow.fadeIn')).to.exist
            expect(document.querySelector('.react-wow.fadeIn').style.animationIterationCount).to.equal('1')
        })

        it('should render children when `offset`', (done) => {
            const height = window.innerHeight + 200

            ReactDOM.render(<ReactWOW offset={100} animation='fadeIn'><Test style={{ marginTop: height }} /></ReactWOW>, div)

            expect(document.querySelector('.react-wow.fadeIn').style.visibility).to.equal('hidden')

            window.scrollTo(0, 100)

            setTimeout(() => {
                expect(document.querySelector('.react-wow.fadeIn').style.visibility).to.equal('visible')
                done()
            }, 1000)
        })

        it('should render children when scrolled visible', (done) => {
            const height = window.innerHeight + 100

            ReactDOM.render(
                <div>
                    <ReactWOW animation='fadeIn'><Test height={height} /></ReactWOW>
                    <ReactWOW animation='fadeOut'><Test height={height} /></ReactWOW>
                </div>
            , div)

            expect(document.querySelector('.react-wow.fadeIn')).to.exist
            expect(document.querySelector('.react-wow.fadeOut').style.visibility).to.equal('hidden')

            window.scrollTo(0, 200)

            setTimeout(() => {
                expect(document.querySelector('.react-wow.fadeOut').style.visibility).to.equal('visible')
                done()
            }, 1000)
        })

        it('should render children when `overflow`', (done) => {
            ReactDOM.render(
                <div style={{ position: 'relative', height: 300, overflow: 'auto' }} className='container'>
                    <ReactWOW animation='fadeIn'><Test /></ReactWOW>
                    <ReactWOW animation='fadeOut'><Test /></ReactWOW>
                </div>
            , div)

            const container = document.querySelector('.container')

            container.scrollTop = 200

            // expect(document.querySelector('.react-wow.fadeIn').style.visibility).to.equal('hidden')

            window.scrollTo(0, 100)

            setTimeout(() => {
                expect(document.querySelector('.react-wow.fadeIn').style.visibility).to.equal('visible')
                done()
            }, 1000)
        })
    })
})
