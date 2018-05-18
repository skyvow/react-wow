# React WOW [![Build Status](https://travis-ci.org/skyvow/react-wow.svg?branch=master)](https://travis-ci.org/skyvow/react-wow) [![npm version](https://img.shields.io/npm/v/react-wow.svg)](https://www.npmjs.org/package/react-wow) [![Coverage Status](https://coveralls.io/repos/github/skyvow/react-wow/badge.svg?branch=master)](https://coveralls.io/github/skyvow/react-wow?branch=master)

Using CSS animation in your react components.

[Demo](https://skyvow.github.io/react-wow)

## 依赖

- [animate.css](https://github.com/daneden/animate.css)

## 安装

```
$ npm install --save react-wow
```

## 示例

```js

import React from 'react'
import ReactDOM from 'react-dom'
import ReactWOW from 'react-wow'

const App = () => <ReactWOW animation='fadeIn'><img src='https://unsplash.it/900/900/?random' /></ReactWOW>

ReactDOM.render(<App/>, document.getElementById('app'))

```

## 使用方法

```sh
$ git clone https://github.com/skyvow/react-wow.git
$ cd react-wow
$ npm install
$ npm start
```

|`npm run <script>`|描述|
|------------------|-----------|
|`dll`|动态链接库，预编译资源模块，必须在`start`之前执行一次。|
|`start`|服务启动在 3000 端口，代码热替换开启。|
|`build`|编译程序到 build 目录下（默认目录 ~/build）。|
|`lint`|检查所有 .js 文件是否规范。[更多](http://eslint.org/docs/user-guide/command-line-interface.html#fix)|
|`dist`|输出编译后的 dist 文件。|
|`test`|运行测试用例，并输出测试覆盖率报告。|
|`ghpages`|部署 GitHub Pages 站点。|

## 感谢

- [WOW](https://github.com/matthieua/WOW)
- [react-lazyload](https://github.com/jasonslyvia/react-lazyload)
- [animate.css](https://github.com/daneden/animate.css)

## 贡献

有任何意见或建议都欢迎提 issue

## License

MIT
