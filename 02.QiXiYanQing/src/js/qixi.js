var lamp = {  // 灯动画
  elem: document.getElementsByClassName('b-background')[0],
  bright: function () {
    console.log(this.elem)
    this.elem.classList.add('lamp-bright')
  },
  dark: function () {
    this.elem.classList.remove('lamp-bright')
  }
}

function doorAction(distL, disR, time) {  // 开关门
  let door = document.getElementsByClassName('door')[0]
  let doorLeft = door.getElementsByClassName('door-left')[0]
  let doorRight = door.getElementsByClassName('door-right')[0]
  return new Promise((resolve, reject) => {
    doorRight.style.transition = doorLeft.style.transition = 'all ' + time + 'ms linear'
    doorLeft.style.left = distL
    doorRight.style.left = disR
    setTimeout(function () {
      resolve()
    }, time)
  })
}

function openDoor() {
  return doorAction('-50%', '100%', 2000)
}

function closeDoor() {
  return doorAction(0, '50%', 2000)
}

/**
 * 小男孩动作
 * @param {[type]} container [description]
 */

let instanceX;

function BoyWalk() {  // 页面容器
  let container = document.getElementById('content-wrap')

  visualWidth = container.clientWidth // 页面可视区域宽度
  visualHeight = container.clientHeight

  let getValue = function (classname) {
    var ele = document.getElementsByClassName(classname)[0]
    return {
      height: ele.offsetHeight,
      top: ele.offsetTop
    }
  }

  let pathY = function () { // 路的中间Y坐标
    let data = getValue('a-background-middle')
    return data.top + data.height / 2
  }()

  let bridgeY = function () {
    let data = getValue('c-background-middle')
    return data.top
  }()

  let boyDom = document.getElementById('boy')
  girlDom = document.getElementById('girl')
  let boyWidth = boyDom.offsetWidth
  let boyHeight = boyDom.offsetHeight

boyDomRotate = function() {
  boyDom.classList.add('boy-rotate')
}

  boyDom.style.top = parseInt(pathY - boyHeight) + 25 + 'px' // 修正小男孩的正确位置 = 路的中间值 - 小孩的高度，25是一个修正值

  /////////////////////////////////////////////////////////
  // ===================动画处理========================= //
  /////////////////////////////////////////////////////////

  girl = {
    setOffset: () => {
      girlDom.style.left = visualWidth / 2 + 'px';
      girlDom.style.top = (bridgeY - girlDom.clientHeight) -25 + 'px'
    },
    rotate: () => {
      return girlDom.classList.add('girl-rotate')
    },
    getOffset: {
      top: () => girlDom.offsetTop
    },
    getWidth: () => {
      return girlDom.clientWidth
    }
  }

  girl.setOffset()

  function pauseWalk() {  // 暂停走路
    // 得到当前tansfrom的实时值
    var transVal = window.getComputedStyle(boyDom).getPropertyValue("transform")
    boyDom.classList.add('pause-walk')
    boyDom.style.transform = transVal
  }

  function restoreWalk() {  // 恢复走路
    boyDom.classList.remove('pause-walk')
  }

  function slowWalk() { // 脚步动作
    // ==========================
    //     增加精灵动画
    // ==========================
    boyDom.classList.add('slow-walk')
  }

  function walkRun(time, distX, disY) { // 开始走路
    time = time || 3000
    slowWalk()
    return stratRun({ left: distX, top: disY }, time)
  }

  function walkToShop(time) { // 走进商店
    let doorElem = document.getElementsByClassName('door')[0]
    let doorLeft = doorElem.getBoundingClientRect().left
    let doorWidth = doorElem.clientWidth

    let boyLeft = boyDom.getBoundingClientRect().left
    //小男孩需要移动的距离 = 门中间的Left值 - 小男孩中间当前位置的left值
    instanceX = (doorLeft + doorWidth / 2) - boyWidth / 2
    return walkRun(time, instanceX)
  }

  function walkInShop(time) {
    restoreWalk()
    return new Promise((resolve, reject) => {
      boyDom.style.transition = 'all ' + time + 'ms linear'
      boyDom.style.transform = `scale(0.3,0.3)`
      boyDom.style.opacity = 0.1
      setTimeout(() => {
        boyDom.style.opacity = 0
        resolve()
      }, time)
    })
  }

  function takeFlower() {
    return new Promise((resolve, reject) => {
      boyDom.classList.add("slow-flower-walk")
      setTimeout(function () {
        resolve()
      }, 1500)
    })
  }

  function walkOutShop(time) {  // 走出商店
    return new Promise((resolve, reject) => {
      boyDom.style.transition = 'all ' + time + 'ms linear'
      boyDom.style.transform = `scale(1,1)`
      boyDom.style.opacity = 1
      setTimeout(() => {
        resolve()
      }, time)
    })
  }

  function stratRun(options, runTime) { // 用transition做运动
    runTime = runTime || 0
    restoreWalk()
    boyDom.style.transition = 'all ' + runTime + 'ms linear'
    if (options.left) boyDom.style.left = options.left + 'px'
    if (options.top) boyDom.style.top = options.top + 'px'
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        resolve() //动画完成
      }, runTime)
    })
  }

  function calculateDist(direction, proportion) { // 计算移动距离
    return (direction == "x" ? visualWidth : visualHeight) * proportion
  }

  return {
    // 走路动作
    walkTo: function (time, proportionX, proportionY) {
      var distX = calculateDist('x', proportionX)
      var distY = calculateDist('y', proportionY)
      return walkRun(time, distX, distY)
    },
    // 走到商店门口
    toShop: function (time) {
      return walkToShop(time)
    },
    // 走进商店
    inShop: function (time) {
      return walkInShop(time)
    },
    // 取花
    takeFlower() {
      return takeFlower()
    },
    // 走出商店
    outShop: function () {
      return walkOutShop()
    },
    // 停止走路
    stopWalk: function () {
      pauseWalk()
    },
    setColor: function (color) {
      boyDom.style.backgroundColor = color
    },
    resetOrigin: function () {
      this.stopWalk()
      boyDom.classList.remove('slow-walk')
      boyDom.classList.remove('slow-flower-walk')
      boyDom.classList.add('boy-original')
    }
  }
}