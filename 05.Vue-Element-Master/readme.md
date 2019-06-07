# Vue-Element-Master

## 知识点

### npm -S -D -g i 有什么区别

devDependencies：开发环境使用
dependencies：生产环境使用

`npm i module_name  -S`
=>  `npm install module_name --save`    写入到 dependencies 对象

`npm i module_name  -D`
=> `npm install module_name --save-dev`   写入到 devDependencies 对象

`npm i module_name  -g`
全局安装
i 是install 的简写

### 1.import|require后面是个文件夹怎么处理

1. 如果import的是一个文件夹，而不是一个文件，则会去搜索该文件夹下的index.js文件，并把它作为import的对象
2. 这个机制并不是来源于ES6, 而是模块的约定：
   - 在node.js模块中，如果requier不是核心模块，而且没有'./'之类的开头，就需要从当前package的node_modules里面找，找不到当前的node_modules就从上层找，一直找到全局node_modules目录
   - 这样找到的往往是文件夹，接下来就处理一个文件目录作为Node模块的情况，如果有package.json, 就根据它的`main字段`找到js. 如果没有，那就默认取文件夹下的`index.js`

### 2.cross-env

> 1. 大多数情况下，在windows平台下使用类似于: NODE_ENV=production的命令行指令会卡住，windows平台与POSIX在使用命令行时有许多区别（例如在POSIX，使用$ENV_VAR,在windows，使用%ENV_VAR%。。。）
> 2. cross-env让这一切变得简单，不同平台使用唯一指令，无需担心跨平台问题

```js
// 安装
npm i --save-dev cross-env

// 使用
{
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
  }
}
```

### 3.http-proxy-middleware

> 1. http-proxy-middleware用于后台将请求转发给其它服务器。
> 2. 例如：我们当前主机A为`http://localhost:3000/`，现在浏览器发送一个请求，请求接口/api，这个请求的数据在另外一台服务器B上（`http://10.119.168.87:4000`），这时，就可通过在A主机设置代理，直接将请求发送给B主机。

## 4.process-env

> 全局变量process表示的是当前的node进程, process.env包含着关于系统环境的信息

**process.env**:并不存在NODE_ENV这个东西。NODE_ENV是用户一个自定义的变量，在webpack中它的用途是判断生产环境或开发环境的依据的

## 命令集合

```js
npm i -D cross-env
npm i -D webpack
npm i -D webpack-cli
```

参考资料：
[webpack升级](https://www.jianshu.com/p/08f1734ad253)