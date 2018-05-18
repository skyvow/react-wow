// 引入依赖
import webpack from 'webpack'
import path from 'path'
import autoprefixer from 'autoprefixer'
import cssImport from 'postcss-import'
import cssMixins from 'postcss-mixins'
import cssExtend from 'postcss-extend'
import conditionals from 'postcss-conditionals'
import cssEach from 'postcss-each'
import cssFor from 'postcss-for'
import nested from 'postcss-nested'
import cssSimpleVars from 'postcss-simple-vars'
import customMedia from 'postcss-custom-media'
import cssAtroot from 'postcss-atroot'
import sprites from 'postcss-sprites'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import OpenBrowserPlugin from 'open-browser-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import CompressionWebpackPlugin from 'compression-webpack-plugin'
import HappyPack from 'happypack'
import os from 'os'
import lodash from 'lodash'
import pkg from './package.json'
import manifest from './manifest.json'

// 配置环境
const ENV = process.env.NODE_ENV
const isDev = ENV === 'development' || ENV === 'dev'
const isProd = ENV === 'production' || ENV === 'prod'

// 公共模块
const deps = lodash.uniq(Object.keys(pkg.dependencies))
const vendor = lodash.pullAll(deps, [])
const jsSourcePath = path.join(__dirname, 'example')
const buildPath = path.join(__dirname, 'build/demo')
const sourcePath = path.join(__dirname, 'example')

// 开启 happypack 多进程的模式加速编译
const happyPackHandle = {
    threadPool: HappyPack.ThreadPool({
        size: os.cpus().length,
    }),
    cacheLoaders: {},
    cachePlugins: [],
    createPlugin(id, loaders) {
        this.cacheLoaders[id] = {
            loaders,
            happypack: `happypack/loader?id=${id}`,
        }
        this.cachePlugins.push(new HappyPack({
            id,
            loaders,
            threadPool: this.threadPool,
            cache: true,
            verbose: true,
        }))
        return this
    },
    getLoaders(id) {
        const { loaders, happypack } = this.cacheLoaders[id]
        return isProd ? loaders[0] : happypack
    },
}

// 创建 happypack 实例对象
happyPackHandle
    .createPlugin('js', ['babel'])
    .createPlugin('css', ['css!postcss'])

// 配置参数
const config = {
    context: jsSourcePath,
    entry: {
        app: [
            './app.js',
        ],
        vendor,
    },
    output: {
        path: buildPath,
        publicPath: '',
        filename: 'assets/js/app.js',
        chunkFilename: 'chunk/[name].chunk.js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: happyPackHandle.getLoaders('js'),
                exclude: [path.resolve(__dirname, 'node_modules')],
            },
            {
                test: /\.css/,
                loader: ExtractTextPlugin.extract('style', happyPackHandle.getLoaders('css'), {
                    publicPath: '../../',
                }),
            },
            {
                test: /\.(gif|jpg|png)\??.*$/,
                loader: 'url-loader?limit=8192&name=assets/images/[hash].[ext]',
            },
            {
                test: /\.(woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=8192&name=assets/fonts/[hash].[ext]',
            },
        ],
    },
    postcss: webpack => {
        const dependent = {
            addDependencyTo: webpack,
        }
        const processors = [
            cssImport(dependent),
            cssMixins,
            cssExtend,
            conditionals,
            cssEach,
            cssFor,
            nested,
            cssSimpleVars,
            customMedia,
            cssAtroot,
            autoprefixer,
        ]
        return processors
    },
    plugins: [
        // 分析和优先考虑使用最多的模块，并为它们分配最小的 ID
        new webpack.optimize.OccurenceOrderPlugin(),
        // 删除重复的依赖
        new webpack.optimize.DedupePlugin(),
        // 跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误
        new webpack.NoErrorsPlugin(),
        // 复制静态文件
        new CopyWebpackPlugin([{
            from: './assets/',
            to: './assets/',
        }]),
        // 合并所有的 CSS 文件
        new ExtractTextPlugin('assets/css/app.css', {
            allChunks: true,
        }),
        // 自动生成页面
        new HtmlWebpackPlugin({
            template: path.join(sourcePath, isDev ? 'index.dev.html' : 'index.html'),
            path: buildPath,
            filename: 'index.html',
        }),
    ],
    resolve: {
        extensions: [
            '',
            '.js',
            '.json',
            '.css',
        ],
        root: [
            path.resolve(__dirname),
            jsSourcePath,
        ],
    },
    devServer: {
        contentBase: isProd ? buildPath : sourcePath,
        // historyApiFallback: true,
        port: 3000,
        // compress: isProd,
        hot: !isProd,
        inline: !isProd,
        // disableHostCheck: true,
        host: '0.0.0.0',
    },
}

// 开发环境
if (isDev) {
    Object.assign(config, {
        plugins: [
            ...config.plugins,
            // 抽离并打包变动不频繁的模块
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest,
            }),
            // 配置全局变量
            new webpack.DefinePlugin({
                __DEBUG__: true,
            }),
            // happypack 插件
            ...happyPackHandle.cachePlugins,
            // 开启全局的模块热替换(HMR)
            new webpack.HotModuleReplacementPlugin(),
            // 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息
            new webpack.NamedModulesPlugin()
            // 打开浏览器
            // new OpenBrowserPlugin({
            //     url: 'http://localhost:3000',
            // }),
        ],
        entry: Object.assign({}, config.entry, {
            app: [
                // 开发环境全局变量配置
                // path.resolve(__dirname, 'dev.config.js'),
                ...config.entry.app,
            ],
        }),
        // 产生.map文件，方便调试
        devtool: 'source-map',
    })
}

// 生产环境
if (isProd) {
    Object.assign(config, {
        plugins: [
            ...config.plugins,
            // 清除文件
            new CleanWebpackPlugin(['build'], {
                root: '',
                verbose: true,
                dry: false,
            }),
            // 提取公共模块单独打包，进而减小 rebuild 时的性能消耗
            new webpack.optimize.CommonsChunkPlugin('vendor', 'assets/js/vendor.js'),
            // 打包压缩 JS 文件
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    drop_console: true,
                }
            }),
            // 压缩成 gzip 格式
            new CompressionWebpackPlugin({
                asset: "[path].gz[query]",
                algorithm: "gzip",
                test: /\.js$|\.css$|\.html$/,
                threshold: 10240,
                minRatio: 0,
            }),
        ],
        entry: Object.assign({}, config.entry, {
            app: [
                // 生成环境全局变量配置
                // path.resolve(__dirname, 'prod.config.js'),
                ...config.entry.app,
            ],
        }),
    })
}

export default config
