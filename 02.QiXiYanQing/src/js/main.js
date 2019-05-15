(function () {
  let config = {
    debug: false,
    keepZoomRatio: false,
    audio: {
      enable: true,
      playURL: '../audio/happy.wav',
      cycleURL: '../audio/circulation.wav'
    },
    layer: {
      width: '100%',
      height: '100%',
      top: 0,
      left: 0
    },
    spendTime: {
      walkToThird: 6000,
      walkToMiddle: 6500,
      walkToEnd: 6500,
      walkToBridge: 2000,
      bridgeWalk: 2000,
      toShop: 500,
      openDoor: 800,
      closeDoor: 500,
      inShop: 1000,
      outShop: 1500,
      waitRotate: 850,
      waitFlower: 800
    }
  }

  let tranisiTimer
  let instanceX
  let container = document.getElementById('content-wrap')
  let visualWidth = container.clientWidth // 页面可视区域宽度
  let visualHeight = container.clientHeight

  if (config.debug) {
    for (var t in config.spendTime) {
      config.spendTime[t] = 500
    }
  }

  if (config.keepZoomRatio) {
    let proportion = 900 / 1440
    let screenHight = window.innerHeight
    let zoomHeight = screenHight * proportion
    let zoomTop = (screenHight - zoomHeight) / 2
  }

  let getValue = function (classname) {
    var ele = document.getElementsByClassName(classname)[0]
    return {
      height: ele.offsetHeight,
      top: ele.offsetTop
    }
  }

  let anmationend = (() => {
    if (~window.navigator.userAgent.indexOf('Webkit')) {
      return 'webkitAnimationEnd'
    }
    return 'anmationend'
  })()

  if (config.audio.enable) {
    Html5Audio(config.audio.playURL).end(function () {
      Html5Audio(config.audio.cycleURL, true)
    })
  }

  let swipe = Swipe(container)
  let boy = boyWalk()
  let girl = girlHandle()

  sanAndCloud()
  boy.walkTo(config.spendTime.walkToThird, .6)
    .then(() => {
      swipe.scrollTo(config.spendTime.walkToMiddle, 1)
      return boy.walkTo(config.spendTime.walkToMiddle, .5) //走到商店
    })
    .then(() => {
      birdfly()
      return boyToShop(boy)
    })
    .then(() => {
      girl.setOffset()
      swipe.scrollTo(config.spendTime.walkToEnd, 2)
      return boy.walkTo(config.spendTime.walkToEnd, .15)
    })
    .then(() => {
      return boy.walkTo(config.spendTime.walkToBridge, .375, girl.getTop() / visualHeight)
    })
    .then(() => {
      return boy.walkTo(config.spendTime.bridgeWalk, (girl.getLeft() - 123) / visualWidth) // 上桥走到小女孩面前
    })
    .then(() => {
      boy.resetOrigin()
      setTimeout(() => {
        girl.rotate()
        boy.rotate(function () {
          snowflake()
        })
      }, config.spendTime.waitRotate)
    })

  /**
    * 小男孩动作
    * @param {[type]} container [description]
    */
  function boyWalk() {
    let boyElement = document.getElementById('boy')
    let boyWidth = boyElement.offsetWidth
    let boyHeight = boyElement.offsetHeight

    let pathY = function () { // 路的中间Y坐标
      let data = getValue('a-background-middle')
      return data.top + data.height / 2
    }()

    boyElement.style.top = parseInt(pathY - boyHeight) + 25 + 'px' // 修正小男孩的正确位置 = 路的中间值 - 小孩的高度，25是一个修正值

    function pauseWalk() {  // 暂停走路
      boyElement.classList.add('pause-walk')
      boyElement.style.transform = window.getComputedStyle(boyElement).getPropertyValue("transform")  // 得到当前tansfrom的实时值重新赋值以暂停动画
    }

    function restoreWalk() {  // 恢复走路
      boyElement.classList.remove('pause-walk')
    }

    function slowWalk() { // 脚步动作
      boyElement.classList.add('slow-walk')
    }

    function walkRun(time, distX, disY) { // 开始走路
      time = time || 3000
      slowWalk()
      return stratRun({ left: distX, top: disY }, time)
    }

    function stratRun(options, runTime) { // 用transition做运动
      runTime = runTime || 0
      restoreWalk()
      return new Promise((resolve, reject) => {
        setTimeout(function () { // 解决元素没加载完成引发的属性冲突问题
          boyElement.style.transition = 'all ' + runTime + 'ms linear'
          if (options.left) boyElement.style.left = options.left + 'px'
          if (options.top) boyElement.style.top = options.top + 'px'
        }, 5)
        if (tranisiTimer) clearTimeout(tranisiTimer)
        tranisiTimer = setTimeout(function () {
          resolve() //动画完成
        }, runTime + 5)
      })
    }

    function walkToShop(time) { // 走进商店
      let doorElem = document.getElementsByClassName('door')[0]
      let doorLeft = doorElem.getBoundingClientRect().left
      let doorWidth = doorElem.clientWidth

      let boyLeft = boyElement.getBoundingClientRect().left
      //小男孩需要移动的距离 = 门中间的Left值 - 小男孩中间当前位置的left值
      instanceX = (doorLeft + doorWidth / 2) - boyWidth / 2
      return walkRun(time, instanceX)
    }

    function walkInShop(time) {
      restoreWalk()
      return new Promise((resolve, reject) => {
        boyElement.style.transition = 'all ' + time + 'ms linear'
        boyElement.style.transform = `scale(0.3,0.3)`
        boyElement.style.opacity = 0
        setTimeout(function () {
          resolve() //动画完成
        }, time)
      })
    }

    function takeFlower() {
      return new Promise((resolve, reject) => {
        boyElement.classList.add("slow-flower-walk")
        setTimeout(function () {
          resolve()
        }, 1500)
      })
    }

    function walkOutShop(time) {  // 走出商店
      return new Promise((resolve, reject) => {
        boyElement.style.transition = 'all ' + time + 'ms linear'
        boyElement.style.transform = `scale(1,1)`
        boyElement.style.opacity = 1
        setTimeout(function () {
          resolve() //动画完成
        }, config.spendTime.waitFlower)
      })
    }

    function turnAround(callback) {
      boyElement.classList.add('boy-rotate')
      if (callback) {
        callback()
        boyElement.addEventListener(anmationend, () => { })
      }
    }

    function calculateDist(direction, proportion) { // 计算移动距离
      return (direction == "x" ? visualWidth : visualHeight) * proportion
    }

    return {
      walkTo: function (time, proportionX, proportionY) { // 走路动作
        var distX = calculateDist('x', proportionX)
        var distY = calculateDist('y', proportionY)
        return walkRun(time, distX, distY)
      },
      toShop: function (time) { // 走到商店门口
        return walkToShop(time)
      },
      inShop: function (time) { // 走进商店
        return walkInShop(time)
      },
      takeFlower() { // 取花
        return takeFlower()
      },
      outShop: function () { // 走出商店
        return walkOutShop()
      },
      stopWalk: function () { // 停止走路
        pauseWalk()
      },
      resetOrigin: function () {
        this.stopWalk()
        boyElement.classList.remove('slow-walk')
        boyElement.classList.remove('slow-flower-walk')
        boyElement.classList.add('boy-original')
      },
      rotate: (callback) => {
        turnAround(callback)
      }
    }
  }

  function birdfly() {
    let birdDom = document.getElementsByClassName('bird')[0]
    birdDom.classList.add('bird-fly')
    birdDom.style.transition = 'all 15000ms linear'
    birdDom.style.transform = 'translateX(-' + container.clientWidth + 'px)'
  }

  function boyToShop(boy) {
    var lamp = {  // 灯动画
      elem: document.getElementsByClassName('b-background')[0],
      bright: function () {
        this.elem.classList.add('lamp-bright')
      },
      dark: function () {
        this.elem.classList.remove('lamp-bright')
      }
    }

    function openDoor(time) {
      return doorAction('-50%', '100%', time)
    }

    function closeDoor(time) {
      return doorAction(0, '50%', time)
    }

    function doorAction(distL, disR, time) {  // 开关门
      let door = document.getElementsByClassName('door')[0]
      let doorLeft = door.getElementsByClassName('door-left')[0]
      let doorRight = door.getElementsByClassName('door-right')[0]
      doorRight.style.transition = doorLeft.style.transition = 'all ' + time + 'ms linear'
      doorLeft.style.left = distL
      doorRight.style.left = disR
      return new Promise((resolve, reject) => {
        doorLeft.addEventListener('transitionend', function () {
          resolve()
        }, true)
      })
    }

    return new Promise((resolve, reject) => {
      boy.toShop(config.spendTime.toShop)
        .then(() => {
          boy.stopWalk()
        })
        .then(() => {
          return openDoor(config.spendTime.openDoor)
        })
        .then(function () { // 开灯
          lamp.bright()
          return boy.inShop(config.spendTime.inShop)
        })
        .then(() => {
          return boy.takeFlower()
        })
        .then(() => {
          return boy.outShop(config.spendTime.outShop)
        })
        .then(() => {
          return closeDoor(config.spendTime.closeDoor)
        })
        .then(() => {
          lamp.dark()
          resolve()
        })
    })
  }

  function girlHandle() {
    let element = document.getElementById('girl')
    let bridgeY = getValue('c-background-middle').top
    return {
      setOffset: () => {
        element.style.left = visualWidth / 2 + 'px';
        element.style.top = (bridgeY - element.clientHeight) - 25 + 'px'
      },
      rotate: () => {
        element.classList.add('girl-rotate')
      },
      getTop: () => {
        return element.offsetTop
      },
      getLeft: () => {
        return element.offsetLeft
      },
      getWidth: () => {
        return element.clientWidth
      }
    }
  }

  function snowflake() {
    let flakeContainer = document.getElementById('snowflake')

    function getImagesName() {
      return './img/snowflake' + Math.floor(Math.random() * 6 + 1) + '.png'
    }

    function createSnowBox() {
      var newDom = document.createElement('div')
      newDom.style.width = '41px'
      newDom.style.height = '41px'
      newDom.style.position = 'absolute'
      newDom.style.top = '-41px'
      newDom.style.zIndex = '9999'
      newDom.style.backgroundImage = 'url(' + getImagesName() + ')'
      newDom.classList.add('snowRoll')
      return newDom
    }

    setInterval(() => {
      let initParam = {
        startLeft: Math.random() * visualWidth - 100,
        startOpacity: 1,
        transY: visualHeight - 40,
        transX: Math.random() * 500 - 100,
        duration: visualHeight * 30 + Math.random() * 5000,
        degree: Math.random() * 360
      }

      let randOpacity = () => {
        let op = Math.random();
        return op < 0.5 ? op + 0.5 : op
      }

      let snowdom = createSnowBox()
      snowdom.style.left = initParam.startLeft + 'px'
      snowdom.style.opacity = randOpacity()
      flakeContainer.appendChild(snowdom)

      setTimeout(function () {
        snowdom.style.transition = 'all ' + initParam.duration + 'ms ease-out'
        snowdom.style.transform = 'translate( ' + initParam.transX + 'px,' + initParam.transY + 'px) rotate(' + initParam.degree + 'deg)'
        snowdom.style.opacity = '0.7'
      }, 200)


      setTimeout(() => {
        flakeContainer.removeChild(snowdom)
      }, initParam.duration + 500)
    }, 400)
  }

  function Html5Audio(url, isloop) {
    let audio = new Audio(url)
    audio.autoPlay = true
    audio.loop = isloop || false
    audio.play()

    return {
      end: function (callback) {
        audio.addEventListener('ended', function () {
          callback()
        }, false)
      }
    }
  }

  function sanAndCloud() {
    // 太阳运动
    document.getElementById('sun').classList.add('rotation')

    document.getElementsByClassName('cloud')[0].classList.add('cloud1Anim') // 飘云
    document.getElementsByClassName('cloud')[1].classList.add('cloud2Anim')
  }
})()


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
    scrollTo: (speed, x) => {
      element.style.transform = 'translate3d(-' + (width * x) + 'px, 0, 0)'
      element.style.transition = 'all ' + speed + 'ms linear'
      return this
    }
  }
}