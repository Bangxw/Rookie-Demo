/**
 * 小孩走路
 * @param {[type]} container [description]
 */

function BoyWalk() {
  // 页面容器
  let container = document.getElementById('content-wrap')

  // 页面可视区域宽度
  let visualWidth = container.clientWidth
  let visualHeight = container.clientHeight

  let getValue = function (classname) {
    var ele = document.getElementsByClassName(classname)[0]
    return {
      height: ele.offsetHeight,
      top: ele.offsetTop
    }
  }

  // 路的中间Y坐标
  let pathY = function () {
    var data = getValue('a-backgound-middle')
    return data.top + data.height / 2
  }

  let boyDom = document.getElementById('boy')
  let boyWidth = boyDom.offsetWidth
  let boyHeight = boyDom.offsetHeight

  // 修正小男孩的正确位置 = 路的中间值 - 小孩的高度，25是一个修正值
  boyDom.style.top = pathY() - boyHeight + 25 + 'px'

  ////////////////////////////////////////////////////////
  //===================动画处理========================= //
  ////////////////////////////////////////////////////////

  // 暂停走路
  function pauseWalk() {
    // 得到当前tansfrom的实时值
    var transVal = window.getComputedStyle(boyDom).getPropertyValue("transform")
    boyDom.classList.add('pause-walk')
    boyDom.style.transform = transVal
  }

  // 恢复走路
  function restoreWalk() {
    boyDom.classList.remove('pause-walk')
  }

  // 脚步动作
  function slowWalk() {
    // ==========================
    //     增加精灵动画
    // ==========================
    boyDom.classList.add('slow-walk')
  }

  // 开始走路
  function walkRun(time, distX, disY) {
    time = time || 3000
    slowWalk()
    return stratRun({ left: distX, top: disY }, time)
  }

  // 用transition做运动
  function stratRun(options, runTime) {
    runTime = runTime || 0
    restoreWalk()
    boyDom.style.transition = 'all ' + runTime + 'ms linear'
    boyDom.style.transform = `matrix(1, 0, 0, 1, ${options.left || 0}, ${options.top || 0})`
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        resolve() //动画完成
      }, runTime)
    })
  }

  // 计算移动距离
  function calculateDist(direction, proportion) {
    return (direction == "x" ? visualWidth : visualHeight) * proportion
  }

  return {
    walkTo: function (time, proportionX, proportionY) {
      var distX = calculateDist('x', proportionX)
      var distY = calculateDist('y', proportionY)
      return walkRun(time, distX, distY)
    },
    stopWalk: function () {
      pauseWalk()
    },
    setColor: function (color) {
      boyDom.style.backgroundColor = color
    }
  }
}