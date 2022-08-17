// confit-override.js
// 按需加载组件代码和样式
// addLessLoader 来帮助加载 less 样式，帮助自定义主题
// 使用插件让 Day.js 替换 momentjs 减小打包大小,
const { override, fixBabelImports, addWebpackPlugin, addLessLoader } = require('customize-cra');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const path = require('path');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#1DA57A' },
  }),
  addWebpackAlias({
    ['src']: resolve('./src')
  }),
  addWebpackPlugin(new AntdDayjsWebpackPlugin())
);