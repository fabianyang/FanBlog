---
title: CSS position relative
categories:
- CSS
tags:
- position relative
date: 2017-01-02 15:04:51
---

### 前言

    `[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)` `[w3c](https://www.w3.org/TR/CSS22/visuren.html#positioning-scheme)`

    相对定位元素（relatively positioned element）是计算后位置属性为 relative 的元素。

    注意：要理解 dom 流概念。

### relative 可以限制 absolute 元素

1. left/bottom/top/right 定位

2. 当 relative 设置具体 z-index 值时，对 absolute 元素的 z-index 有限制作用

3. 限制超越 overflow

- `overflow: hidden;` 可以让普通元素溢出隐藏，但对绝对定位元素没有作用。除非 relative 进行限制。

- 如果 `overflow: auto;` 或 `overflow: scroll;` 里面 absolute 元素原本是不受滚动影响的。

但加上 relative 也可以影响绝对定位元素，使绝对定位元素滚动。

### relative 限制不了 fixed

只可限制 z-index 层级。

#### relative 的自身定位特性

1. relative 相对于自身初始流位置进行定位。

2. 无侵入 (不影响其他元素位置)

同样的效果，如果使用 `margin-top: -150px` 就会影响其他元素布局。

使用场景：可以实现自定义拖拽。虽然浏览器已经有拖拽 API 兼容性也不错，但是不足时不能定义属性和元素 ui 表现。

原理：拖动时，原本位置不变，目标位置元素页 relaive 到交换位置，判断松手后，刷新 dom 结构，完成位置交换。

3. 同时设置对立属性 (top-bottom/left-right)

- 绝对定位 absolute 是拉伸。
- 相对定位 relative 是斗争。 `top` `left` 属性优先起作用，`bottom` `right` 失效。
 
#### relative 的层级 z-index

1. 提高层叠上下文

网页一般 dom 流后面的元素会覆盖前面的元素。但前面元素添加了 relative 属性之后，直接提高层级，无视 dom 流。

> 层叠上下文：简单可以理解为上下的垂直关系。

2. 新建层叠上下文与层级控制

```css
position: relative;
z-index: auto;
```

> The stack level of the generated box in the current stacking context is 0. If the box has 'position: fixed' or if it is the root, it also establishes a new stacking context.

如果 relative 的 z-index 变为 auto ?

官方解释：这种情况是不会新建层叠上下文的，对里面的 absolute 元素的层叠是没有限制的。和 `z-index: 0;` 不能看作是同样情况。

但不包括 ie6, ie7 ，是一个 bug, `z-index: auto;` 也会新建层叠上下文，不符合规范，容易出现层叠覆盖 bug 。

### relative 影响最小化原则（经验，实践）

所谓 relative 影响最小化原则：指尽量降低 relative 对其他元素或布局的潜在影响（比如：层叠问题）。

解决 ie6, ie7 bug:

- 首先，尽量不适用 relative 。

错误观念：absolute 外层一定要有 relative 限制包裹。

正确思想：absolute 和 relative 是两个值，**absolute 不依赖 relative**。

实例：元素之定位在左上角。可以不用 left, top 定位，使用负 margin 微调。

```html
<div>
    <img src="pig_head.png" style="position: absolute;">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
</div>
```

因为没有 relative 存在，所以不会影响其他元素的层级

- 其次，relative 影响最小化。

实例：元素定位在右上角，同时容器宽高自适应。

```html
<div>
    <div style="position: relative;">
    <img src="pig_head.png" style="position: absolute;top: 0;right: 0;">
    </div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
</div>
```

只使用 `margin-right` 偏移不好控制。需要使用 `text-align` 右对齐。

给大容器设置 relative 可以容易实现，但是很容易导致层叠问题。

应用 relative 最小化影响原则：

独立出一个 relative div 不会占据任何尺寸，里面元素 absolute 定位。这样，relative 只会限制里面的 absolute 元素，不影响其他元素，不会出现层叠的 bug。