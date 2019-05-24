# Vue-Element-Master

## 知识点

### 1.cross-env

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

## 命令集合

```js
npm i -D cross-env
npm i -D webpack
npm i -D webpack-cli
```