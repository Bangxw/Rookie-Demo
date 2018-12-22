// 页面滑动
function Swipe (container) {
  var element = container.find(':first')

  // 滑动对象
  var swipe = {}
  var slides = element.find('>')

  // 容器尺寸
  var width = container.width()
  var height = container.height()

  element.css({
    width: width * slides.length + 'px',
    height: height + 'px'
  })
  $.each(slides, function (index, ele) {
    $(ele).css({
      height: height + 'px',
      width: width + 'px'
    })
  })

  swipe.srollTo = function (x, speed) {
    element.css({
      'transition-timing-function': 'linear',
      'transition-duration': speed + 'ms',
      'transform': 'translate3d(-' + x + 'px, 0,0 )'
    })
    return this
  }
  return swipe
}
