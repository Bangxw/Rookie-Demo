// 页面容器
let container = document.getElementById('content-wrap')

// 页面可视区域宽度
let visualWidth = container.clientWidth
let visualHeight = container.clientHeight


let swipe = Swipe(container)

var getValue = function (classname) {
  var ele = document.getElementsByClassName(classname)[0]
  return {
    height: ele.offsetHeight,
    top: ele.offsetTop
  }
}

let boyDom = document.getElementById('boy')
let boyHeight = boyDom.offsetHeight

// 路的中间Y坐标
let pathY = function () {
  var data = getValue('a_background_middle')
  return data.top + data.height / 2
}

// 修正小男孩的正确位置 = 路的中间值 - 小孩的高度，25是一个修正值
boyDom.style.top = pathY() - boyHeight + 25 + 'px'


function calculateDist(direction, proportion) {
  return (direction == "x" ? visualWidth : visualHeight) * proportion
}


////////////////////////////////////////////////////////
//===================动画处理========================= //
////////////////////////////////////////////////////////

function walkRun(time, distX, disY) {
  time = time || 3000
  slowWalk()
  let d1 = stratRun({ left: distX, top: disY }, time)
  return d1
}

function restoreWalk() {
  boyDom.classList -= 'pause-walk'
}

function slowWalk() { //脚步动作
  // ==========================
  //     增加精灵动画
  // ==========================
  let classList = boyDom.classList.value
  if (!/slow-walk/gi.test(classList)) boyDom.className += ' slow-walk'
}

function stratRun(options, runTime) {
  var dfdPlay = $.Deferred();
  runTime = runTime || 0
  restoreWalk()
  boyDom.style.transition = 'all ' + runTime + 'ms linear'
  boyDom.style.transform = `martix(1, 0, 0, 1, ${options.left || 0}, ${options.top || 0})`
  return dfdPlay
}
