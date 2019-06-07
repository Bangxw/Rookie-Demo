/* eslint-disable */
require('eventsource-polyfill')
/*
  webpack-hot-middleware 是和webpack-dev-middleware配套使用的。从上一篇文章中知道，webpack-dev-middleware是一个express中间件，实现的效果两个，一个是在fs基于内存，提高了编译读取速度；第二点是，通过watch文件的变化，动态编译。但是，这两点并没有实现浏览器端的加载，也就是，只是在我们的命令行可以看到效果，但是并不能在浏览器动态刷新。那么webpack-hot-middleware就是完成这件小事的
*/
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true') // 浏览器动态刷新

hotClient.subscribe((event) => {
  if (event.action === "reload") {
    window.location.reload()
  }
})