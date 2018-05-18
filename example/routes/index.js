export default [
    {
        path: '/',
        getComponent (nextState, cb) {
            require.ensure([], (require) => {
                cb(null, require('../containers/main').default)
            }, 'index')
        },
    },
    {
        path: '404',
        getComponent (nextState, cb) {
            require.ensure([], (require) => {
                cb(null, require('../containers/notfound').default)
            }, 'notfound')
        },
    },
    {
        path: '*',
        indexRoute: {
            onEnter (nextState, replace) {
                replace('/404')
            },
        },
    },
]
