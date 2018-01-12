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

1. 一个属性值，一个属性名。

特点：宽、高不占据任何尺寸

2. 相同属性表现，包裹性，破坏性。容易导致塌陷。

```css
.box {
    padding: 10px;
    background-color: #f0f0f0;
}
input {
    position: absolute; top: 234px;
    width: 160px; height: 32px;
    font-size: 100%;
}
```

```html
<div class="box">
    <img id="image" src="http://img.mukewang.com/54447b06000171a002560191.jpg" width="256" height="191">
</div>
<input id="button" type="button" value="图片absolute化">
```

```js
// 破坏性
var eleImg = document.getElementById("image"), eleBtn = document.getElementById("button");
if (eleImg != null && eleBtn != null) {
    eleBtn.onclick = function() {
        if (this.absolute) {
            eleImg.style.position = "";
            this.value = "图片absolute化";
            this.absolute = false;
        } else {
            eleImg.style.position = "absolute";
            this.value = "图片去absolute";
            this.absolute = true;
        }
    };
}
```

```js
// 包裹性
var eleBox = document.getElementById("box"), eleBtn = document.getElementById("button");
if (eleBox != null && eleBtn != null) {
    eleBtn.onclick = function() {
        if (this.absolute) {
            eleBox.style.position = "";
            this.value = "容器absolute化";
            this.absolute = false;
        } else {
            eleBox.style.position = "absolute";
            this.value = "容器去absolute";
            this.absolute = true;
        }
    };
}
```

3. 页面布局可以相互替换

> css-absolute-float-replace

### absolute 和 relative 限制

误区: *绝对定位 absolute 元素一定需要 relative 限制才能进行定位。*

![img](http://olq0r66c9.bkt.clouddn.com/md/1515592688168.png)

1. 独立的 absolute 元素可以摆脱 overflow 限制，无论滚动或隐藏。

因为绝对定位 absolute 并不是相对于其父元素定位的，而是相对于其"包含块"定位的，如果给其父元素 position:relative 另其形成新的"包含块"，内部的关闭按钮就也会滚动了

```css
body {
    background-color: #bbb;
}
.scroll {
    width: 500px; height: 300px;
    margin: 200px auto 0;
    margin-top: -webkit-calc(50vh - 150px);
    margin-top: calc(50vh - 150px);
    border: 1px solid #ccc;
    border-radius: 3px;
    box-shadow: 0 0 3px rgba(0,0,0,.35);
    background-color: #fff;
    overflow: auto;
}
.close {
    position: absolute;
    width: 34px; height: 34px;
    margin: -17px 0 0 483px;
    background: url(http://img.mukewang.com/5444835b000100ce00340075.png) no-repeat;
}
.close:hover {
    background-position: 0 -41px;
}
img {
    display: block;
    margin: 10px;
}
```

```html
<div class="scroll">
    <a href="javascript:" class="close" title="关闭"></a>
    <img src="http://img.mukewang.com/54447b06000171a002560191.jpg">
    <img src="http://img.mukewang.com/54447f550001ccb002560191.jpg">
</div>
```

2. 不受 relative 限制的 absolute 定位。即：使用绝对定位构建不影响其他布局的相对定位。

特点：不使用 top/bottom/left/right 任何一个属性或 auto 作为值。

表现：脱离文档流。同时固定在初始文档流上方重叠。

```css
input[type=button] {
    height: 32px;
    font-size: 100%;
}
```

```html
<img src="http://img.mukewang.com/54447b06000171a002560191.jpg">
<img src="http://img.mukewang.com/54447f4a0001eb7d01910256.jpg">
<img src="http://img.mukewang.com/54447f550001ccb002560191.jpg">
<p><input type="button" id="button" value="点击第2张图片应用position:absolute变天使"></p>
```

```js
var button = document.getElementById("button"),
    image2 = document.getElementsByTagName("img")[1];
if (button && image2) {
    var value_init = button.value;
    button.onclick = function() {
        if (this.value == value_init) {
            image2.style.position = "absolute";
            this.value = "撤销";
        } else {
            image2.style.position = "";
            this.value = value_init;
        }
    };
}
```

3. absolute 去除浮动，导致 float 失效

```css
input[type=button] {
    height: 32px;
    font-size: 100%;
}
```

```html
<img src="http://img.mukewang.com/54447b06000171a002560191.jpg">
<img src="http://img.mukewang.com/54447f4a0001eb7d01910256.jpg">
<img src="http://img.mukewang.com/54447f550001ccb002560191.jpg">
<p><input type="button" id="float" value="点击第2张图片应用float:left"></p>
<p><input type="button" id="button" value="点击第2张图片应用position:absolute"></p>
```

```js
var flbtn = document.getElementById("float"),
    button = document.getElementById("button"),
    image2 = document.getElementsByTagName("img")[1];
if (flbtn && button && image2) {
    var value_init = button.value;
    button.onclick = function() {
        if (this.value == value_init) {
            image2.style.position = "absolute";
            this.value = "撤销";
        } else {
            image2.style.position = "";
            this.value = value_init;
        }
    };

    flbtn.onclick = function() {
        image2.style["cssFloat" in this.style? "cssFloat": "styleFloat"] = "left";
    };
}
```

4. absolute 与位置跟随

block 水平元素，和文字不会在同一行显示。绝对定位后，依然换行显示。但这个元素如果是 inline 或 inline-block 水平跟在文字后面，在绝对定位后，依然在文字后面。

- chrome 浏览器下元素 absolute 后改变 `diplay:block;` 不会重新渲染。除非一进页面 absolute 和 `display: block;` 同时存在。

- ie7 下任何元素 absolute 后永远 inline-block 水平，所以只会实现跟随显示效果，不会显示换行效果。

解决：套一层空的 div 。

```css
input[type=button] {
    height: 32px;
    font-size: 100%;
}
p { margin-left: 260px; }
img + p { margin-top: 60px; }
```

```html
<img src="http://img.mukewang.com/54447b06000171a002560191.jpg">
<div><img src="http://img.mukewang.com/54447f4a0001eb7d01910256.jpg"></div>
<img src="http://img.mukewang.com/54447f550001ccb002560191.jpg">
<p><input type="button" id="block" value="点击第2张图片应用display:block"></p>
<p><input type="button" id="button" value="点击第2张图片应用position:absolute变天使"></p>
```

```js
var block = document.getElementById("block"),
    button = document.getElementById("button"),
    image2 = document.getElementsByTagName("img")[1];
if (block && button && image2) {
    var value_init_button = button.value;
    button.onclick = function() {
        if (this.value == value_init_button) {
            image2.style.position = "absolute";
            this.value = "撤销";
        } else {
            image2.style.position = "";
            this.value = value_init_button;
        }
    };

    var value_init_block = block.value;
    block.onclick = function() {
        if (this.value == value_init_block) {
            image2.style.display = "block";
            this.value = "撤销";
        } else {
            image2.style.display = "";
            this.value = value_init_block;
        }
    };
}
```

- 配合 margin 的精确定位，支持负值定位，兼容性好，ie6+

#### 不影响绝对定位的相对定位实例

1. 图片、图标使用绝对定位覆盖到其它元素上。

- 优点：自适应性好，省掉多余的 relative

- 原本位置很重要，使用的是 absolute 位置跟随性。

注意 vip 显示位置：众所周知，一个图片跟随一个文字，图片和文字应该一行显示。绝对定位元素宽高不占据尺寸，如果绝对定位元素前面有哪怕 1px 的空白像素间距或其他偏差，由于固定宽度，位置就会错乱。

2. 下拉框定位实例

写组件时，建议使用，无依赖绝对定位。

3. 对齐居中或边缘

使用无依赖绝对定位特性，实现居中或定位效果。

居中效果实现方式举例：

4. 星号显示，图文对齐，文字溢出

> 无依赖绝对定位为页面布局与重构提供了更丰富的选型思路。

### absolute 的层级

#### absolute 的重绘、回流

Tip: 动画尽量作用在绝对定位元素上。

因为： absolute 脱离文档流特性，如何运动都不会影响其他元素。

垂直空间的层级，后来居上。一般 dom 流后面的元素会覆盖前面的元素。

*z-index 误区：绝对定位 absolute 元素一定需要 z-index 控制层级，确定其显示。*

#### absolute 的 z-index 无依赖

1. 如果只有一个绝对定位元素，自然不需要 z-index ，自动覆盖普通元素。

2. 如果两个绝对定位，控制 dom 流前后顺序达到覆盖效果，依然无 z-index 。

3. 如果多个绝对定位交错，网页中非常少见的情况，`z-index: 1;` 可以控制.

所以，如果**非弹框类**的绝对定位元素，如果 z-index > 2 必定 z-index 有冗余，需要优化。

### left,top,right,bottom 配合使用后，不受限制

除非遇到另一个 position 不为 static 的限制 `position: relative|absolute|fixed|sticky;`

### left,top,right,bottom 与 width / height

#### 相互替代

举例：已知 `html, body {height: 100%}，实现一个全屏自适应的 50% 黑色半透明的蒙层。

通常

```css
.overlay {
    position: absolute;
    width: 100%; height: 100%;
    left: 0; top: 0;
}
```

其实，可以没有 width / height 实现

```css
.overlay {
    position: absolute;
    left: 0; top: 0; right: 0; bottom: 0;
}
```

很多情况，绝对定位方向对立导致拉伸，可以和 width / height 相互替代。

对立属性导致拉伸特性 ie7+ 才支持。

差异 - 拉伸更强大。

实例：实现一个距离右侧 200px 的全屏自适应容器。

使用拉伸

```css
.box {position: absolute; left: 0; right: 200px;}
```

但使用 width 只能使用 css3 的 calc 计算

```css
.box {position: absolute; left: 0; width: (100% - 200px);}
```

#### 相互支持

1. 容器无需固定 width / height 值，内部元素也可拉伸。

```css
.container {
    display: inline-block;
    position: relative;
}
.cover {
    position: absolute;
    left: 0; top: 0; right: 0; bottom: 0;
    background-color: #fff;
    opacity: .5; filter: alpha(opacity=50);
}
```

```html
<div>
    <i class="cover"></i>
    <img src="mm-l.jpg" width="512" height="381">
</div>
<div>
    <i class="cover"></i>
    <img src="mm-s.jpg" width="256" height="191">
</div>
```

实例：css 驱动的左右半区翻图效果。

```css
.prev, .next {
    width: 50%;
    *background-image: url(about:blank);
    position: absolute; top: 0; bottom: 0;
    outline: none;
}
.prev {
    cursor: url(pic_prev.cur), auto; left: 0;
    cursor: url(pic_next.cur), auto; right: 0;
}
```

2. 容器拉伸，内部元素支持百分比 width / height 值。

通常：元素的百分比 height 要有效果，需要父级容器的 height 值不能是 `auto` 。

但是，绝对定位拉伸下，即使父级容器 height 值是 `auto`，只要容器绝对定位拉伸已经形成，百分比高度也是支持的。

实例：高度自适应九宫格布局。（单页自适应布局）

```css
.page {
    position: absolute;
    left: 0; top: 0; right: 0; bottom: 0;
}
.list {
    float: left;
    height: 33.3%; width: 33.3%;
    position: relative;
}
```

#### 相互合作

如果绝对定位拉伸和 width / height 尺寸同时存在。

width / height 设置尺寸**大于** left,top,right,bottom 拉伸的尺寸。

```css
.box {
    position: absolute;
    left: 0; top: 0; right: 0; width: 50%;
}
```

上面代码，容器实际宽度是 50% 而不是 100%;

当尺寸限制和 `margin: auto;` 同时出现时，可以实现绝对定位元素的**绝对居中**效果

注意：绝对居中特性 ie8+ 支持。其他情况使用 js 实现。

### absolute 页面整体布局，适合移动 web 的布局策略

与 fixed,relative 一样，absolute 设计初衷就是为了定位 (position) 。

absolute 拥有更多特有性质，不仅仅局限覆盖和定位。

使用好的话，会发现：兼容性好，自适应强，扩展方便，性能优异。实现效果多，适合移动和 PC 。

1. `body` 降级，子元素升级 (div 升级为页面容器) 实现满屏。

```html
<body>
    <div class="page"></div>
</body>
```

```css
.page {
    position: absolute;
    left: 0; top: 0; right: 0; width: 50%;
}
```

由于绝对定位受限父级，所以 page 拉伸需要 `html, body { height: 100%; }`。

默认情况，`body` 标签高度是 0 ， page 单纯拉伸依然高度是 0 。

2. 各模块，头、尾、侧边栏 (PC) 各居其位。

```css
header, footer { position: absolute; left: 0; right: 0; }
header {height: 48px; top: 0;}
footer {height: 48px; bottom: 0;}
aside {width: 250px; position: absolute; left: 0; top: 0; bottom: 0; }
```

3. 内容想象成 body

```css
.content {
    position: absolute;
    left: 250px; top: 48px; bottom: 52px;
    overflow: auto;
}
```

此时，头尾以及侧边都是 fixed 效果，不跟随滚动。避免了移动端 `position: fixed;` 实现时的诸多问题。

`overflow:auto;` 作用：Container 有滚动特性。

此时，头、尾、及侧边都是 `fixed` 效果，不跟随滚动。**可以避免移动端 fixed 的问题。**

4. 全屏覆盖与页面 (page) 平级，蒙层 (overlay)

```html
<body>
    <div class="page"></div>
    <div class="overlay"></div>
</body>
```

```css
.overlay {
    position: absolute;
    left: 0; top: 0; right: 0; bottom: 0;
    background-color: rgba(0,0,0,.5);
    z-index: 9;
}
```

此时，蒙层和页面互不影响。