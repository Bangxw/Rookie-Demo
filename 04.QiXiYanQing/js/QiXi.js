var lamp = {
  elem: $('.b_background'),
  bright: function () {
    this.elem.addClass('lamp_right')
  },
  dark: function () {
    this.elem.removeClass('lamp_right')
  }
}

function doorAction (left, right, time) {
  var defer = $.Deferred()
  var doorLeft = $('.door-left')
  var doorRight = $('.door-right')
  var count = 2
  var complete = function () {
    if (count == 1) {
      defer.resolve()
      return
    }
    count--
  }

  doorLeft.transition({
    'left': left
  }, time, complete)

  doorRight.transition({
    'left': right
  }, time, complete)

  return defer
}

function openDoor () {
  return doorAction('-50%', '100%', 2000)
}

function shutDoor () {
  return doorAction('0', '50%', 2000)
}

var instanceX

function BoyWalk () {
  var container = $('#content')
  var visualWidth = container.width()
  var visualHeight = container.height()

  var swipe = Swipe(container)
  var getValue = function (className) {
    var $elem = $('' + className + '')
    return {
      height: $elem.height(),
      top: $elem.position().top
    }
  }
  var pathY = function () {
    var data = getValue('.a_background_middle')
    return data.top + data.height / 2
  }()

  var $boy = $('#boy')
  var boyHeight = $boy.height()
  var boyWidth = $boy.width()

  $boy.css({
    top: pathY - boyHeight + 25
  })

  function pauseWalk () {
    $boy.addClass('pauseWalk')
  }

  function restoreWalk () { // 恢复走路
    $boy.removeClass('pauseWalk')
  }

  function slowWalk () {
    $boy.addClass('slowWalk')
  }

  function calculateDist (direction, proportion) { // 计算移动距离
    return (direction == 'x' ? visualWidth : visualHeight) * proportion
  }

  function startRun (options, runTime) {
    var dfdPlay = $.Deferred() // 创建
    restoreWalk()
    $boy.transition(options, runTime, 'linear', function () {
      dfdPlay.resolve() // 动画完成
    })
    return dfdPlay
  }

  function walkRun (runtime, x, y) {
    runtime = runtime || 3000
    slowWalk()
    var d1 = startRun({
      'left': x + 'px',
      'top': y ? y : undefined
    }, runtime)
    return d1
  }

  function walkToShop (runtime) {
    var defer = $.Deferred()
    var door = $('.door')
    instanceX = (door.offset().left + door.width() / 2) - ($boy.offset().left + boyWidth / 2)
    var walkPlay = startRun({
      transform: 'translateX(' + instanceX + 'px),scale(0.3, 0.3)',
      opacity: 0.1
    }, 2000)

    walkPlay.done(function () {
      $boy.css({
        opacity: 0
      })
      defer.resolve()
    })
    return defer
  }

  function walkOutShop (runtime) {
    var defer = $.Deferred()
    restoreWalk()
    var walkPlay = startRun({
      transform: 'translateX(' + instanceX + 'px),scale(1, 1)',
      opacity: 1
    }, runtime)

    walkPlay.done(function () {
      defer.resolve()
    })
    return defer
  }

  function talkFlower () {
    var defer = $.Deferred()
    setTimeout(function () {
      $boy.addClass('slowFlolerWalk')
      defer.resolve()
    }, 1000)
    return defer
  }

  return {
    walkTo: function (time, proportionX, proportionY) { // 开始走路
      var distX = calculateDist('x', proportionX)
      var distY = calculateDist('y', proportionY)
      return walkRun(time, distX, distY)
    },
    stopWalk: function () { // 停止走路
      pauseWalk()
    },
    toShop: function () { // 走进商店
      return walkToShop.apply(null, arguments)
    },
    outShop: function () { // 走出商店
      return walkOutShop.apply(null, arguments)
    },
    talkFlower: function () { // 取花
      return talkFlower()
    },
    setColor: function (value) {
      $boy.css('background-color', value)
    },
    getWidth: function (value) {
      return $boy.width()
    },
    resetOriginal: function () {
      this.stopWalk()
      $boy.removeClass('slowWalk slowFolorWalk').addClass('boyOriginal')
    },
    setFlolerWalk: function () {
      $boy.addClass('slowFlolerWalk')
    },
    rotate: function (callback) {
      restoreWalk()
      $boy.addClass('boy-rotate')
      if (callback) {
        $boy.on('animationend', function () {
          callback()
          $(this).off()
        })
      }
    }
  }
}
