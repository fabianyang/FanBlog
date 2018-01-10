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
