---
title: CSS margin
categories:
- CSS
tags:
- margin
date: 2017-01-10 15:04:51
---

### 前言

    `[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/margin)` `[w3c](https://www.w3.org/TR/CSS22/box.html#margin-properties)`

    margin 属性为给定元素设置所有四个（上下左右）方向的外边距属性。

### margin 重叠

#### 特点

1. 发生在普通 block 水平元素。

不包括 `float` `position:absolute` 元素，不包括 `<button>` `<img>` 标签。

2. 只发生在垂直方向。

不考虑 wiriting-mode （可以让文字从上往下排）

#### 场景

1. 相邻兄弟元素

2. 父子第一个、最后一个子元素

子元素设置 `margin-top` 作用等同于父元素同时设置 `margin-top`

3. 空的 block 元素

相当于自己与自己发生 margin 重叠

#### 父子 margin 重叠的其他条件

1. 父元素非块状格式上下文 (BFC) 元素 - overflow 课程有讲

2. 父元素没有 `border-top` 或 `padding-top`

3. 父子元素间没有 inline 元素分隔 (空格 &nbsp; 、图片、文字)

4. 父元素没有 `height` `min-height` `max-height` 限制

### 空 block 重叠条件

1. 没有 `border` 或 `padding`

2. 里面没有 inline 元素

3. 没有 `height` 等声明

### 重叠计算规则

1. 正正取大值
2. 正负值相加
3. 负负最负值

### 善用 margin 重叠

故意使用：更具有健壮性，最后一个元素移除或位置调换，不会破坏原布局。

建议：制作列表或垂直布局时，`margin-top` `margin-bottom` 同时使用。

```css
.list{
    margin-top:15px;
    margin-bottom: 15px;
}
```

### margin 与容器尺寸

margin 可以改变容器尺寸。 relative 绝对不会改变容器的尺寸或占用空间。

条件：

1. 适用没有设定 width / height 的普通元素。 `float` `absolute|fixed` `inline` `table-cell` 不适用。

2. 只是用水平方向尺寸。

利用特性：实现一侧定宽的自适应布局。

### margin 与占据尺寸

1. `block` `inline-block` 水平元素适用。

2. 与 width / height 无关。

3. 水平、垂直方向都适用。

利用特性：实现上下留白。 padding 不行。

### margin 与百分比单位

注意：**是相对于宽度计算的**

利用特性：实现宽高 2:1 的容器自适应。

```css
.box {overflow: hidden;}
.box > div {margin: 50%;}
```

### `margin: auto;`

作用机制：

1. 普通元素，没有设置宽高也会自动充满容器。

2. 设置 width / height 后，原本全部填充部分，会出现空白空间。

3. `margin: auto;` 就是为填充这部分空间设计的。

#### 图片为什么没有水平居中？

因为，图片是 inline 水平元素，就算没有 width 页不会占满整个容器，没有剩余空间。

所以，设置 `img{display: block}` 就算没有 width ，也会占满整个空间。

此时，会有剩余空间给 `margin: auto;` 分配。

图片、按钮、视频都属于替换元素 (replace element) 比较特殊。

#### 为什么容器定高，元素定高，`margin: auto` 无法垂直居中

原因还在于有无剩余空间。如果不设定 height 元素会占满整个容器吗？试问自己一下。

Tip: 实现居中用 `margin: auto;` 必须，计算的剩余空间的值，不能是负值。

比如：父元素 `1000px` ，子元素 `2000px` ，`margin: auto;` 不能居中。

##### writing-mode 实现垂直居中。

原理：writing-mode 和 vertical-align 改变页面流方向。

##### 绝对定位元素实现

absolute 的拉伸特性：子元素 `left:0;top:0;right:0;bottom:0;` 填满容器。

同时子元素设置 width / height 。此时，自动填充被干掉，出现空白区域。

ie8+ 支持。

### margin 负值实现定位布局效果

1. 两端对齐：利用改变元素尺寸的特性 `margin-right: -20px`

2. 等高布局：利用改变元素占据空间

很大的 margin-bottom 负值，很大 padding-bottom 填充缺失空间，父元素 `overflow: hidden;`

3. 两栏自适应布局：利用元素占据空间跟随 margin 移动

不足： dom 顺序和最终视觉顺序不符

### **有时 margin 无效解析**

1. inline 水平元素，垂直方向 margin 无效。

前提：

- inline 元素是替换元素 (img button)
- 正常书写模式：没有 `direction` `writing-mode` 等

2. 是否形成了 margin 重叠

3. `display: table-cell`

4. 绝对定位元素：非定位方向的 margin 无效

容器添加 `position: relative;` 发生例外

5. 鞭长莫及

6. 内联特性：默认基线对齐，文字不可能跑到内联容器外

`margin-start` `margin-end`

> `direction: vtl;` 流从右到左