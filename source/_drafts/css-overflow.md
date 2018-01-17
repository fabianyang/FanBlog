---
title: CSS overflow
categories:
- CSS
tags:
- overflow
date: 2017-01-10 15:04:51
---

### 前言

    `[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/overflow)` `[w3c](https://www.w3.org/TR/CSS22/visufx.html#propdef-overflow)`

    overflow 属性指定当内容溢出其块级容器时,是否剪辑内容，显示滚动条或显示溢出的内容。

### overflow 基本属性、基本表现、兼容性

- visible: 默认
- hidden: 隐藏，不剪裁
- scroll: 添加滚动条
- auto: 尺寸溢出，出现滚动条
- inherit: 不常用，因为和其它 css3 属性的 inherit 值一样，有兼容性问题， ie8+ 支持。

#### overflow-x / overflow-y (ie8+)

规范：

- 如果 overflow-x 和 overflow-y 值相同则等同于 overflow 。
- 如果 overflow-x 和 overflow-y 值不同，如果其中一个值为 `visible` ，另外一个值为 `hidden|scroll|auto` 那么 `visible` 会被重置为 auto。

#### 滚动条

1. 样式各个浏览器不一样，都很丑，chrome 可以自定义。
2. 宽度设定机制各个浏览器不一样。 ie7 下元素宽度 100% 也会出现滚动条。

### overflow 起作用的前提

1. 非 `display: inline` 水平元素。

2. 对应方位的尺寸限制。 width / height / max-width / max-height 

3. 对于单元格 td 等，还需要设置 `<table>` 标签 `table-layout: fixed` 才行。

### 滚动条出现的条件

1. `overflow: auto|scroll` `<html>` `<textarea>`

2. 呢绒高度超出 `<textarea>` 文本域高度，图片高度超过 `<div>` 高度。

### `<body>` `<html>` 与滚动条

无论什么浏览器，默认滚动条都是来自 `<html>` 而不是 `<body>`

原因：新建一个空白 `<html>` 页面，`<body>` 默认有 `.5em ≈ 8px` `margin` 值.

如果是来自 `<body>` 的话，应该滚动条旁边会有边距，而不是靠着浏览器边缘。

ie7 浏览器：默认 `html{overflow-y:scorll;}`

ie8+ 等浏览器：默认 `html{overlow:auto;}`

所以，想要去除页面默认滚动条，只需要设置 `html{overflow:hidden;}` 没有必要 ~~`html,body{overflow:hidden;}`~~

#### js 与滚动高度

- Chrome: `document.body.scrollTop`

- 其他浏览器： `document.documentElement.scrollTop`

目前，两者不会同时存在，获取方法应使用短路写法而不是简单相加。

```js
var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
```

### overflow `padding-bottom` 缺失现象

原因：不兼容导致，不一样的元素内容高度 `scrollHeight` 。

#### 滚动条会占用容器的可用宽度或高度

简单获得方法

滚动条出现可能导致错位

解决方法：预留空间，自适应布局

#### 水平居中跳动问题

1. ie9- 使浏览器默认 `html{overflow:scroll;}` 显示滚动条

2. ie9+ 浏览器宽减去可用内容宽 `.container {padding-left: calc(100vw - 100%)}`

### overflow 与 BFC

清除浮动和自适应布局

#### BFC: Block formatting context 块状格式化上下文

特性：内部元素任何改变都不会影响外部元素

触发条件：`overflow: auto|scroll|hidden;` visible 不可以触发 BFC 。

应用场景：

- 清除浮动影响
- 避免 margin 穿透、重叠问题
- 两栏自适应布局

##### 内部浮动无影响 ie7+ 支持

通常清除浮动 `.clearfix{overflow:hidden; _zoom:1}`

副作用：让容器外元素不可见，无法广泛应用。

```css
.clear {*zoom: 1;} /*ie6,7*/
.clear:after {content: '';display: table;clear: both;} /*ie8+*/
```

更通用，样式无干扰。

避免 margin 穿透 overflow 只是很多方法中的一种。

##### 为什么会这么表现？

流体特性下的自适应布局。

前提：内容区域和浮动元素重叠， `clear:both;` 会无法保持不动的，因此，让块状布局和浮动元素完全独立出来，才符合 BFC 特性。

流体自适应布局和 BFC 自适应布局是两个截然不同的方式，不可以掺杂在一起。

注意：所有 BFC 属性都有如此表现。但由于自身特性，具体表现不一。

- `overflow: hidden;` “溢出不可见” 限制应用场景。
- float + float 包裹性 + 破坏性 无法自适应。应该使用块状浮动布局。
- `position: absolute;` 脱离文档流，自娱自乐，没有适用场景。
- `display: inline-block;` 包裹性，无法自适应。ie6,7 不认识 `inline-block` 统一 `block` 水平。
- `display: table-cell;` 报错性，但无溢出特性，绝对宽度也能自适应。


### 两栏自适应布局

1. 与清除浮动类似

`.cell{overflow:hidden; _zoom:1}` 副作用明显。

```css
.cell {
    display: table-cell; width: 2000px; /*ie8+ BFC 特性*/
    *display: inline-block;*width: auto; /*ie7 伪 BFC 特性+*/
}
```

只适用 block 水平元素， `<div>` `<p>` 标签。

### overflow 与绝对定位

隐藏失效与滚动固定

`overflow: hidden;` 失效，滚动失效。

失效原因：`overflow: hidden;` 在包含块之间

避免方法:

- overflow 元素自身为包含块。
- overflow 元素的子元素为包含块。
- 任意合法的 tansform 声明当做包含块 (新增)