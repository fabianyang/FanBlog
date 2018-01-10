---
title: CSS Padding
categories:
- CSS
tags:
- padding
date: 2017-01-02 15:04:51
---

### 前言

    不想说废话，上链接。`[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/padding)` `[w3c](https://www.w3.org/TR/CSS22/box.html#padding-properties)`

    padding 区域指一个元素的内容和其边界之间的空间，该属性不能为负值。

### padding 与 block 元素

- padding 在 `width` 属性给定固定宽度时，默认可以改变元素尺寸。

```css
.box { width: 30px; padding: 0 50px; }
```

- padding 在 `width: auto;` 或 `box-sizing: border-box;` 的情况下，没有改变元素尺寸。只是内容空间缩小了。

```css
.box { width: 80px; box-sizing: border-box; padding: 0 15px;}
```

```html
<div> 真的没有影响尺寸？</div>
```

```css
.text { width: 50px; box-sizing: border-box; padding: 0 15px; }
```

- 如果设置 padding 非常大，一定会影响元素的尺寸，内容空间只能展示最小宽度时。

```css
.text { width: 60px; box-sizing: border-box; padding: 0 30px; }
```

PS: 感觉 `box-sizing` 的属性限制没有影响。

### padding 与 inline 元素

水平方向 padding 影响尺寸， 垂直方向 padding 不影响尺寸。但是会影响背景色（占据空间）大小。

![img](http://olq0r66c9.bkt.clouddn.com/md/1515418685176.png)

此时，`clientHeight` 不变，但 `scrollHeight` 如果 padding 导致占据空间大于父级限制时，会影响垂直方向尺寸。

> 占据空间： inline 盒模型 content-area

#### 实例

利用特性：可以实现高度可控的分割线。

![img](http://olq0r66c9.bkt.clouddn.com/md/1515418953527.png)


### padding 不支持任何形式的负值

### block 元素 padding 的百分比值

- padding 百分比是相对于宽度计算的。

利用特性：

- 实例：轻松实现正方形容器。 `div { padding: 50%; }` 兼容性好 *ie7+* 。

- 实例：移动端 h5 页面头图。

![img](http://olq0r66c9.bkt.clouddn.com/md/1515419292509.png)

为什么不使用 vm 单位？有部分 Android 机器还是不支持 vm 单位。

### inline 元素 padding 的百分比值

1. padding 同样相对宽度计算的。

2. 默认宽高有细节差异。block 元素宽高一样。

3. inline 元素文字换行会导致背景色换行。

![inline 元素的 padding 断行](http://olq0r66c9.bkt.clouddn.com/md/1515419463685.png)

4. 空的 inline 元素的 padding 宽高也不相等。

![img](http://olq0r66c9.bkt.clouddn.com/md/1515419587260.png) 

为什么会有额外的高度？

原因：inline 元素的垂直方向 padding 会让 "幽灵空白节点" 显现，也就是规范中的 "strut"。

PS: "幽灵空白节点" 在 `line-height` `vertical-align` 提到过。本质就是 inline 内联元素，`content-area` 区域只受到 `font-size` 影响。

### 标签元素的内置 padding

1. `ol` `ul` 列表

内置 padding-left ，但是单位是 px (绝对值) 不是 em (相对文字大小)

例如：chrome 大概是 40px;

所以，字号很小间距会很大，字号很大序号会到外层容器外面。

![img](http://olq0r66c9.bkt.clouddn.com/md/1515419861792.png)

![img](http://olq0r66c9.bkt.clouddn.com/md/1515419907078.png)

分享经验：一般网页文字是 `12px` `14px` 。对应 `padding-left` `22px` 到 `25px` 比较合适。基本实现需要和文字对齐。

### 表单元素的内置 padding

1. 所有浏览器 `<input>` `<textarea>` 输入框都有 `1px` 到 `2px` 内置 padding。

2. 所有浏览器 `<radio>` `<checkbox>` 无内置 padding，设置 padding 也不起效果。

3. 部分浏览器 `<select>` 下拉框。如： firefox, ie8+ 可设置 padding 。

4. 所有浏览器 `<button>` 按钮内置 padding 最难控制。

- Chrome OK `button {padding: 0}`

- FireFox `padding: 0;` 左右依然有 padding。

解决方法：

```css
button::-moz-focus-innner { padding: 0; };
```

- ie7 文字越多左右 padding 越大。

解决方法：规范也没有解释为什么。

```css
button { overflow: hidden; }
```

- `<button>` padding 与高度内容不兼容，计算有问题

```css
button {
    line-height: 20px;
    padding: 10px;
    border: none;
}
```

表现结果：
ie7 45px; ie8+ 40px; FF 42px; Chrome 40px;

所以，`<button>` 兼容性不好，使用率低，往往使用 `<a>` 标签模拟。

然而有时必须使用原生的 `<button>` 按钮。使用默认内置表单提交行为。

例如：`<form>` `type='submit'` 类型按钮，默认：出现在页面上就可以触发表单回车提交事件。

个人建议小技巧： `<label for="button_id">` 实现。同时，真正的 `<button>` 可访问性隐藏

> 可访问性隐藏：不是 `display:none;` 或者 `visible: hidden;` 而是绝对定位到屏幕外或者 `z-index: -1;` 放到背景色下面。

```html
<button id="btn"></button>
<label for="btn">按钮</label>
```

```css
label {
    display: inline-block;
    line-height: 20px;
    padding: 10px;
}
```

### padding 与图形绘制

1. 实现三道杠菜单标签。不借助伪元素，只用一个 div 。

![img](http://olq0r66c9.bkt.clouddn.com/md/1515420595108.png)

为什么背景色没有把 padding 区域覆盖？

css3 `background-clip` 背景色只在内容区域显示

```css
backgroud-color: currentColor;
backgroud-clip: content-box;
```

2. 实现白眼效果

![img](http://olq0r66c9.bkt.clouddn.com/md/1515420771522.png)

### padding 布局实战

1. 使用百分比单位构建固定比例布局结构。1:1, 2:1, 4:1 ...

- 手机移动端 1:1 头图 `padding: 50%;`

2. 配合 margin 实现等高布局。

![img](http://olq0r66c9.bkt.clouddn.com/md/1515420920909.png)

- 很大的 `margin-bottom` 负值，很大的 `padding-bottom` 填充。

3. 两栏自适应布局

- padding 在容器上

![img](http://olq0r66c9.bkt.clouddn.com/md/1515421010846.png)

- padding 在子元素上

![img](http://olq0r66c9.bkt.clouddn.com/md/1515421056745.png)

因为 `float` `absolute` 具有破坏性，破坏流，不影响原本流显示。
