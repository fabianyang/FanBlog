---
title: CSS z-index
categories:
- CSS
tags:
- z-index
date: 2017-01-02 15:04:51
---

### 前言

    `[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/z-index)` `[w3c](https://www.w3.org/TR/CSS22/visuren.html#z-index)`

    z-index 属性指定了一个元素及其子元素的 z-order。 当元素之间重叠的时候，z-order 决定哪一个元素覆盖在其余元素的上方显示。 通常来说 z-index 较大的元素会覆盖较小的一个。

    注意：要理解 dom 流，层叠上下文概念。

### z-index 的属性值

默认：`auto`;

基本特性：
1. 支持负值
2. 支持 (css3 animation)
3. css2.1 时，需要和定位元素配合使用。

如果不考虑 css3, 只有定位元素 `position: relative|absolute|fixed|sticky;` 的 z-index 才有作用。

在 css3 中有例外。

### 嵌套表现以及 z-index 计算规则

#### z-index 与定位属性

如果定位元素 z-index 没有发生嵌套，后面的元素在上面，哪个 z-index 值大，哪个在上面。

官网解释：如果定位元素 z-index 发生嵌套，前提：z-index 是数值非 `auto` ，祖先优先。

### 理解 css 中的层叠上下文 (stacking level) 和层叠水平 (stacking level)

重要概念：理解元素层叠表现的基础。三维概念。

1. 页面根元素天生具有层叠上下文。
2. z-index 值为数值时，定位元素具有层叠上下文。
3. 层叠上下文中的每个元素都有一个层叠水平，决定同一个层叠上下文中元素在 z 轴上的显示顺序。
4. 层叠水平和 z-index 不是同一个概念。普通元素也有层叠水平，z-index 只在定位元素中起作用。

### 理解元素的层叠顺序 (stacking order)
1. 7 阶层叠水平 (stacking order)。
2. 规范元素重叠时候的呈现规则。
3. 更符合页面加载的功能和视觉呈现。
4. 内容是页面最重要的实体。因此，层叠水平更高。
5. 背景覆盖是层叠水平顺序，文字是覆盖后来居上。

### z-index 与层叠上下文，解释 z-index 的实际行为表现
1. 定位元素，默认 `z-index: auto;` 等于 `z-index: 0;`。
2. z-index 不为 `auto` 的定位元素会创建层叠上下文。
3. z-index 比较层叠顺序止步于父级层叠上下文。

#### 为什么定位元素会覆盖普通元素

从层叠顺序上讲 `z-index: auto;` 可以看成 `z-index: 0;`

但从层叠上下文来讲 `z-index: auto;` 不会创建层叠上下文。 `z-index: 0;` 才会创建。

但不包括 ie7 浏览器。