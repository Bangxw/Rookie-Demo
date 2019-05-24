# 七夕言情/HTML5+CSS3+JS

关键点：小男孩的移动和背景(背景定位)的移动形成视觉差

技术点：

1. 全程用原生的JS完成, 主要在DOM操作
2. 动画的完成依靠css3实现（transform, transition, animation）
3. 运用Promise封装动作的前后衔接
4. animation实现的帧动画需要暂停时通过`animation-play-state: paused`操作, transition实现的渐变动画暂停只能通过重新赋值为当前值

总结：

1. 自适应分辨率的问题可以采用的是JS+百分比布局处理
2. 通过合成‘雪碧图‘解决图片加载与资源占用的问题
3. 通过css3的animation实现帧动画，并且可以控制状态
4. 布局除了left, top之外， 还可以使用最新的css3 transform处理
5. 元素的变化， 可以通过设置tranlsate3d启动GPU加速
6. 可以用css3的transition做渐变动画
7. HTML5音频使用
8. 采用Promise解决异步编程的逻辑嵌套问题
9. 代码组织的思路