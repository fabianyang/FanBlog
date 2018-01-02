---
title: CSS position absolute
categories:
- CSS
tags:
- position absolute
date: 2017-01-02 15:04:51
---

### 前言

    `[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)` `[w3c](https://www.w3.org/TR/CSS22/visuren.html#positioning-scheme)`

    绝对定位元素（absolutely positioned element）是计算后位置属性为 absolute 的元素。

    注意：要理解 dom 流概念。

### absolute 与 float 比较

1. 一个属性值，一个属性名

2. 包裹性，破坏性。容易导致塌陷。

3. 页面布局可以相互替换


### absolute 和 relative 限制

1. 独立的 absolute 元素可以摆脱 overflow 限制，无论滚动或隐藏。

2. 不受 relative 限制的 absolute 定位。即：使用绝对定位构建不影响其他布局的相对定位。

特点：不使用 top/bottom/left/right 任何一个属性或 auto 作为值。

表现：脱离文档流。同时固定在初始文档流上方重叠。

#### 实例：图片、图标富态到其它元素上。
- 优点：自适应性好，省掉多余的 relative

- 原本位置很重要，使用的是 absolute 位置跟随性。

3. absolute 去除浮动，导致 float 失效

#### absolute 与位置跟随

- chrome 一进页面就是 absolute 页面不会重新渲染。除非一进页面 absolute 和 `display: block;` 同时存在。

- ie7 永远 inline-block 水平

- 配合 margin 的精确定位，支持负值定位，兼容性好，ie6+

### absolute 的重绘、回流

Tip: 动画尽量作用在绝对定位元素上。

垂直空间的层级，后来居上。一般 dom 流后面的元素会覆盖前面的元素。

z-index 误区：绝对定位 absolute 元素一定需要 z-index 控制层级，确定其显示。

### absolute 的 z-index 无依赖

1. 如果只有一个绝对定位元素，自然不需要 z-index ，自动覆盖普通元素。

2. 如果两个绝对定位，控制 dom 流前后顺序达到覆盖效果，依然无 z-index 。

3. 如果多个绝对定位交错，非常少见的情况，`z-index: 1;` 控制.

所以，如果非弹框类的绝对定位元素，如果 z-index > 2 必定 z-index 有冗余，需要优化。

### left,top,right,bottom 不受限制

除非遇到另一个 position 与 width/ height

实例：实现蒙层

对立属性导致拉伸 ie7+ 支持。和 width 可以相互替代，拉伸更强大。

实例：实现一个距离右侧 200px 的全屏自适应容器。

### absolute 与 width

#### 相互相持

1. 容器无需固定 width,height 值，内部元素也可拉伸。

实例：css 驱动的左右半区翻图效果。

2. 容器拉伸，内部元素支持百分比 width,height 值。

通常：元素的百分比 height 要有效果，需要父级容器的值不能是 `auto` 。

绝对定位拉伸下，即使父级容器 height 是 `auto`，只要容器绝对定位拉伸已经形成，百分比高度也是支持的。

实例：高度自适应九宫格布局。

#### 相互合作

width,height 设置尺寸大于 left,top,right,bottom 拉伸的尺寸。

可以实现绝对定位元素的居中效果

`margin: auto;` 同时存在。 ie8+ 支持。

### absolute 整体页面布局，适合移动 web 的布局策略

与 fixed,relative 一样，absolute 设计初衷就是为了定位 (position) 。

使用好的话，会发现：兼容性好，自适应强，扩展方便，性能优异。实现效果多，适合移动和 PC 。

1. `body` 降级，子元素升级 (div 升级为页面容器)

2. 各模块，头、尾、侧边栏 (PC) 各居其位

3. 内容想象成 `body` (`overflow: auto`)

`overflow:auto;` 滚动有 Container 特性。

此时，头、尾、及侧边都是 `fixed` 效果，不跟随滚动。**可以避免移动端 fixed 的问题。**

4. 全屏覆盖与页面(page)平级，蒙层 (overlay)