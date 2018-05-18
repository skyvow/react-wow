import webpack from 'webpack'
import path from 'path'
import lodash from 'lodash'
import pkg from './package.json'

// 公共模块
const deps = lodash.uniq(Object.keys(pkg.dependencies))
const vendor = lodash.pullAll(deps, [])
const jsSourcePath = path.join(__dirname, 'example')
// const buildPath = path.join(__dirname, 'build/demo')

export default {
    context: jsSourcePath,
    entry: {
        vendor,
    },
    output: {
        path: 'example/assets/js',
        filename: '[name].js',
        library: '[name]',
    },
    plugins: [
        // 动态链接库，预编译资源模块
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]',
            context: __dirname,
        }),
    ],
}
