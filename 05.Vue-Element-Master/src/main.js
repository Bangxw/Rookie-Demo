import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'
// import store from './store'
import { routerMode } from './config/env'
import FastClick from 'fastclick'

/**
 * Dom文档加载步骤：
 * 1. 解析html结构
 * 2. 加载外部脚本和样式表文件
 * 3. 解析并执行脚本代码
 * 4. 构造html dom模型 // DOMContentLoaded
 * 5. 加载图片等外部文件
 * 6. 页面加载完毕 //load
 */
if ('addEventListener' in document) {
  document.body.onload = function () {
    // console.log('111')
  }

  document.addEventListener('DOMContentLoaded', function () {
    // console.log('222')
    //移动端触摸、点击事件优化
    FastClick.attach(document.body)
  }, false)
}

Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  mode: routerMode, //hash
  strict: process.env.NODE_ENV !== 'production', // 不要在发布环境下启用严格模式！
  scrollBehavior(to, from, savedPosition) { // 使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return { x: 0, y: to.meta.savedPosition || 0 }
    }
  }
})

new Vue({
  router
}).$mount('#app') // 手动挂载