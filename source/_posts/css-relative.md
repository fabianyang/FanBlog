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

3. 原本 absolute 元素不受 overflow 限制

如果 `overflow: auto;` 或 `overflow: scroll;` absolute 元素不受浮动影响。

但加上 relative 也可以影响 absolute 。

### relative 限制不了 fixed

只可限制 z-index 层级。


#### relative 的定位

1. relative 相对于自身初始流位置进行定位。

2. 无侵入 (不影响其他元素位置)

同样的效果，如果使用 `margin-top: -150px` 就会影响其他元素

使用场景：可以实现自定义拖拽。虽然浏览器已经有拖拽 API 兼容性也不错，但是却不能定义寿星和元素 ui 表现。

3. 同时设置对立属性 (top-bottom/left-right)

- 绝对定位 absolute 是拉伸。
- 相对定位 relative 是斗争。 `top` `left` 属性优先。


#### relative 的层级 z-index

1. 提高层叠上下文

一般 dom 流后面的元素会覆盖前面的元素。但前面元素添加了 relative 属性之后，直接提高层级，无视 dom 流。

2. 新建层叠上下文

```css
position: relative;
z-index: auto;
```
> The stack level of the generated box in the current stacking context is 0. If the box has 'position: fixed' or if it is the root, it also establishes a new stacking context.

官方解释：这种情况是不会新建层叠上下文的，对立面的元素 (如：absolute) 没有限制。和 `z-index: 0;` 不能看作是同样情况。

但不包括 ie6, ie7 ，是一个 bug, 也会新建层叠上下文，不符合规范，容易出现层叠覆盖 bug 。

### relative 影响最小化原则（经验，实践）

影响最小化原则：指尽量降低 relative 对其他元素或布局的潜在影响（比如：层叠问题）。

解决 ie6, ie7 bug:

- 首先，尽量不适用 relative 。

错误观念：absolute 外层一定要有 relative 限制包裹。

正确思想：absolute 和 relative 是两个值，absolute 不依赖 relative。

实例：元素之定位在左上角。可以不适用 left, top 定位，使用负 margin 微调。

- 其次，relative 影响最小化。

实例：元素定位在右上角，同时容器宽高自适应。

`margin-right` 偏移不好控制。

实现方式：使用 `text-align` 右对齐一个独立的 relative div 。里面元素 absolute 定位。这样，relative 只会限制里面的 absolute 元素。