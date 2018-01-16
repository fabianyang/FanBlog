---
title: CSS vertical-align
categories:
- CSS
tags:
- vertical-align
date: 2017-01-02 15:04:51
---

### `vertical-align` 支持的属性值

- 线类 `vertical-align:baseline|top|middle|bottom;`
- 文本类 `vertical-align:text-top|text-bottom;`
- 上标、下标类 `vertical-align:sub|super;`
- 数值、百分比类 `vertical-align: 20px|2em|20%;`

css 支持负值属性并不多， `margin` `letter-spacing` `word-spacing` `vertical-align` 。

`1em` 相当于 1个单位的 `font-size` 。

`vertical-align` 设置数值，意义就是，在 `baseline` 对齐基础上上下偏移对应数值大小。

`vertical-align` 设置百分比，是相对于 `line-height` 计算的。IE6, IE7 下设置百分比，不支持小数 `line-height` 。

### `vertical-align` 起作用的前提，各个 `display` 值的影响。

> 为什么设置 `vertical-align` 没有起作用？

规范：`vertical-algin` 应用于 `inline` 以及 `table-cell` 元素。

- `inline` 水平

`inline` => `<img>` `<span>` `<strong>` `<em>` ...

`inline-block` => `<input>` ie8+, `<button>` ie8+ ...

- `table-cell` 元素：`<td>`

所以，近似认为，默认状态下，图片、按钮、文字和单元格支持 `vertical-align`

> 为什么强调“默认状态”？

因为，`display` 或有些 css 声明，会更改元素显示水平。


ie7+ 并且图片和父标签必须有换行，不能连在一起，才能实现设置行高近似垂直居中。
