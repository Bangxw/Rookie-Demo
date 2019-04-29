/*
 * [Swipe description]
 * @param {[type]} container [页面容器节点]
 * @param {[type]} options [参数]
 */
function Swipe(container) {
  // 获取第一个元素节点
  let element = container.firstElementChild // list-page-group
  let swipe = {}

  let slides = element.children // list-page-item集合

  let width = container.offsetWidth
  let height = container.offsetHeight

  element.style.width = slides.length * width + 'px'
  element.style.height = height + 'px'

  // 给每个list-page-item赋值
  for (var t of slides) {
    t.style.width = width + 'px'
    t.style.height = height + 'px'
  }

  swipe.scrollTo = function (x, speed) {
    element.style.transform = 'translate3d(-' + (width * x) + 'px, 0, 0)'
    element.style.transition = 'all ' + speed + 'ms linear'
    return this
  }

  return swipe
}