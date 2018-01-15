---
title: CSS border
categories:
- CSS
tags:
- border
date: 2017-01-02 15:04:51
---

# 前言

链接

## 为什么 `border-width` 不支持百分比值？

`border-width` 不支持百分比值，是由语义和使用场景决定的。

原因：不同设备的 `border-width` 如果设置一样，不应该因为设备大就按比例变大的，不会根据百分比设置变化。

其他类似的属性还有：`outline` `box-shadow` `text-shadow` 也不支持百分比。

`border-width` ie8+ 还支持关键字：`thin`(1px), `medium`(3px), `thick` (5px)。 默认：`medium`

#### 为什么 `border-width` 默认值是 `medium` 3px 呢？应该 `thin` 1px 更常用！

猜测：因为 `border-style: double` 要 3px 才起作用。

### `border-style` 类型

1. `border-style：solid;`
2. `border-style：dashed`

浏览器虚线比例不一样

ie 下是 2:1 显示比较密集，Chrome,FireFox 是 3:1 。

如果想让 Chrome,FireFox 也显示密集一些， css3 `border-image` 可以实现，但兼容性不好。

所以由于兼容性问题，虚线形式只能做一个边框，没法做一些图形。

3. `border-style：dotted`

浏览器点线形状不一样。

Chrome,FireFox 是小方型。

IE 下为小圆型。利用这个特性可以实现 ie7, ie8 CSS 圆角效果，类似 `border-radius` 效果

```css
.box{width:150px;height:150px;overflow:hidden;}
.dotted{width:100%;height:100%x;border:149px dotted:#cd0000}
```

> 实现任意大小的园怎么办？

http://olq0r66c9.bkt.clouddn.com/md/1515933619060.png

4. `border-style:double`

双线计算规则：中间的值表示透明部分的像素大小。

- 1px: 0+1+0
- 2px: 1+0+1;
- 3px: 1+1+1;
- 4px: 1+2+1;
- 5px: 2+1+1;

最终，实线部分宽度一定是相等的。即：双线宽度永远相等，中间间隔+-1。

利用双线兼容性好的特性：可以用来绘制图形。

**制作移动端常用的三行展开按钮**

padding 课程，利用 `background-clip` 可以实线三道杠效果。是 css3 属性。

如果要兼容 ie7,ie8 可以使用双线边框。

```css
{
    width:120px;height:20px;
    border-top:60px double;
    border-bottom:20px solid;
}
```

5. 其他
- `border-style:inset;` 内凹
- `border-style:outset;` 外凸
- `border-style:groove;` 沟槽

基本没有使用场景，为什么要设计出来？源于审美，风格过时，兼容性差浏览器样式不一，被淘汰。

### `border-color` 与 `color`

`border-color` 默认颜色就是 `color` 。

当 `border-color` 没有设置颜色的时候，边框颜色默认是 `color` 的颜色，`color` 设置成什么颜色，边框就会变成什么颜色。

```css
.box{
     border: 10px solid;
     color: #00f;
}
```

唯一不同是 Chrome 有内嵌 3D 效果。可以忽略。

类似有这种特性的还有 `text-shadow` `box-shadow` `outline` 等属性

#### 有什么用？

案例：hover 与图形变色。

```css
.add{display:block; width:100px; height:100px; transition:color 0.25s;
border:1px solid; color:orange;position:relative;}
.add:before{content:""; width:80px; border-top:10px solid; position: absolute; top:45px;left:10px;}
.add:after{content:""; height:80px; border-left:10px solid;position: absolute; top:10px;left:45px;}
.add:hover{color:red;}
```

添加 hover 图形变色效果。

传统实现，需要三处 hover 变色。

```css
.add{border:1px solid #ccc;}
.add:before, .add:after {background: #ccc}
.add:hover{color: #06c;}
.add:hover:before, .add:hover:after{background: #06c;}
```

利用 border 特性的话，仅1处需要更改颜色。


```css
.add{colore: #ccc; transition: color .25s; border: 1px solid;}
.add:before{border-top: 10px solid;}
.add:after{border-left: 10px solid;}
.add:hover{color: #06c;}
```

只要一个 `color` `hover` 变化，就可以一起变色！且 `transition` 过渡也只要一个 `color` 属性，只在父元素上添加即可。

### `border` 与 `background` 定位

border宽度不可使用百分比，受此限制，无法用于百分比布局需要；

boder-color属性可继承color，因此可用于一次性优化多个布局；

border可以透明，transparent属性，可利用此属性生成三角或者梯形；

border-style中的double及dotted可用于创建三条短线样式、圆。

border以及background配合使用，可以定位背景图片至右侧。（backgroud-positon默认相对左上角）

### CSS2.1 `background` 定位的局限

- 只能相对于左上角数值定位，不能相对右下。

例如：背景图片需要距离边缘 50px 很简单，距离右边缘就不好实现。

比如：多层标签嵌套。或使用 css3 `background-position` 设置距离右边缘定位。

http://olq0r66c9.bkt.clouddn.com/md/1515936139374.png

#### 借助 `border` 实现

- 固定相对右下角

方法：留下间距大小的透明边框。

原理：`background-position` 定位默认不计算 `border` 区域。

```css
{
    border-right: 50px solid transparent;
    background-position: 100% 40px;
}
```

### `border` 构建三角图形

```css
.triangle {
    border-width: 12px 20px;
    border-style: solid;
    border-color: red red transparent transparent;
}
```


#### 实现三角的原理

继承了 3D 凹凸槽效果的实现原理，边框拐点处是斜角 45° 的直线。

```css
.triangle {
    width: 100px; height:100px;
    border: 100px solid;
    border-color: red green blue orange;
}
```

width / height 变为 0 时，形状不再是梯形，变为三角形。

对应方向边框颜色变透明，可实现三角形。

实际使用场景

http://olq0r66c9.bkt.clouddn.com/md/1515939493427.png

#### 更高级应用：模拟圆角实现 css3 `border-radius`

兼容性好，原理：`border` 梯形组合而成，实现圆角。

```css
.triangle {
    width: 317px;
    border: 100px solid;
    border-color: transparent transparent #c00;
}
```

### `border` 与透明边框很有用

`border-color: transparent;` 透明边框，始于 IE7 , 兼容性好。

`color: transparent;` ie9+ 才支持。

比如：`background-position` 定位；三角实现；

#### 增加点击区域大小

不用图片实现单、复选框效果。

比如：视觉区域大小（不含边框）16px*16px

```css
.checkbox {
    width: 16px; height: 16px;
    border: 1px solid #d0d0d5;
}
```

上面代码，除了不好向下兼容外，点击区域略小。

```css
.checkbox {
    border: 2px solid transparent;
    box-shadow: inset 0 1px,inset 1px 0,inset -1px 0,inset 0 -1px;
    background-color: #fff;
    background-clip: content-box;
    color: #d0d0d5;
}
```

上面代码，原先 `border` 变透明用来增加点击区域，真正边框使用盒阴影，现在复选框点击区域大小为 20px*20px ，更加规范。

#### 增加可视渲染区域

css3 滤镜 `drop-shadow` 可以给 png 图标变色。原始方式使用 svg, font-face 。

http://olq0r66c9.bkt.clouddn.com/md/1515940764174.png

```css
.icon{filter: drop-shadow(20px 0 #ff8040);}
```

不能使用 `overflow: hidden;` ,因为在 Chrome 浏览器下页面中不可见元素，`drop-shadow` 也是不可见的。

不仅是 `overflow: hidden;` , `text-indent` 负值隐藏原始图， `clip` 剪裁隐藏，`margin` 负值隐藏原始图，`left` 负值隐藏。都无法投影，隐藏原始图标失败。只要元素原始图片在可视区域外，投影就没有。

解决思路：既然可视区域外元素无投影，可以可视区域变大，进行区域内透明。

```css
.icon {
    position: relative; left: -20px;
    border-right: 20px solid transparent;
    filter: drop-shadow(20px 0 #ff0000);
}
```

因此可以用 `border` 透明边框，区域内隐藏。

### `border` 在布局中的应用

平时可能不多，但实际很有用，兼容性好。

#### 有限标签下的标题栏

通常标题栏实现，使用额外的 `<div>` 或 h5 标签。

但有时 html 是不能修改的，比如：第三方插件生成的，修改的话不利于维护。可以考虑使用 `border` ，不常用，所以不展开。

#### `border` 等高布局

之前，使用 `margin` 负值，`padding` 负值实现等高布局。

局限：由于有很大的负值使用，所以，如果有锚点定位时，可能会出现布局飞上去的效果。

```html
<div class="box">
    <nav class="left">
        <h3>nav1</h3>
    </nav>
    <section>
        <div class="module">module1</div>
    </section>
</div>
```

```css
.box{border-left:200px solid #222;}
.left{width:200px;margin-left:-200px;float:left;}
.module{width:300px;background:yellow;}
```

原理：其实就是父元素给左边 `border-left` 一块背景色区域，文字区域是子元素通过 `margin` 负值定位的。

局限：由于 `border` 不支持百分比，所以宽度不能支持百分比。

所以，实现两栏等高布局需要根据实际需求，如果一侧宽度固定，就使用 `border` 实现，如果是百分比的就使用 `margin` `padding` 实现。