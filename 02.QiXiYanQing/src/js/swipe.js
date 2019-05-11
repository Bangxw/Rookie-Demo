/*
 * [Swipe description]
 * @param {[type]} container [页面容器节点]
 * @param {[type]} options [参数]
 */
function Swipe(container) {
  /*
   * 元素节点
   * element: 第一个元素节点list-page-group
   * slides: list-page-item的集合
   */
  let element = container.firstElementChild
  let slides = element.children

  let width = container.offsetWidth
  let height = container.offsetHeight

  // 设置list-page-group盒子的长宽
  element.style.width = slides.length * width + 'px'
  element.style.height = height + 'px'

  // 给每个list-page-item赋值
  for (var t of slides) {
    t.style.width = width + 'px'
    t.style.height = height + 'px'
  }

  return {
    scrollTo: (x, speed) => {
      element.style.transform = 'translate3d(-' + (width * x) + 'px, 0, 0)'
      element.style.transition = 'all ' + speed + 'ms linear'
      return this
    }
  }
}