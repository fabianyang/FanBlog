---
title: CSS line-height
categories:
- CSS
tags:
- line-height height
date: 2017-01-02 15:04:51
---

### line-height 定义

line-height 两行文字基线之间的距离。

#### 什么是基线？为什么是基线？需要两行么？

英文里，一般基线就是字母 `x` 下边缘位置。基线是为了写英文字母排列整齐用的。

基线是任何线定义的根本。

#### 可不可以是中线？或底线？一行文字就没有行高？

可以

#### baseline 知识拓展

![img508](http://olq0r66c9.bkt.clouddn.com/md/1516023972277.png)

1. "alphabetic" baseline: "字母" 基线
1. "hanging" baseline: "悬挂" 基线，比如：印度文字
1. "ideographic" baseline: "表意" 基线，比如：中文

中线：基线上 1/2 x 的高度。

### baseline 与行高

![img640](http://olq0r66c9.bkt.clouddn.com/md/1516024373208.png)

### baseline 与字体

![img640](http://olq0r66c9.bkt.clouddn.com/md/1516024416342.png)

### baseline 与 `line-height: 200px`

`line-height: 200px` 是如何定义划分高度的。

![img640](http://olq0r66c9.bkt.clouddn.com/md/1516024599537.png)

### 为什么 `line-height` 可以让单行文本垂直居中？真的垂直居中了吗？

并不是完全垂直居中，只是看上去垂直居中，只有 `font-size: 0` 时才真正垂直居中。

图片也是属于文本，当 `font-size: 14px;` 时，通过 `line-height` 垂直居中，看起来图片稍稍偏下，当字体调到很大时，偏差就会更明显。

## `line-height` 与行内框盒子模型

非常重要：因为所有内联元素的样式表现都与行内框盒子模型有关。比如：浮动元素图文环绕效果。

```html
<p>这是一行普通文字，这里有个 <em>em</em> 标签。</p>
```

以上代码包含了 4 种盒子模型。

1. 内容区域（content area）：是一种围绕文字看不见的盒子。内容区域（content area）的大小与font-size大小相关。

可以理解为选中文字时的高亮部分。

2. 内联盒子（inline boxes）：内联盒子不会让内容成块显示，而是排成一行。如果外部含 inline 水平的标签（span,a,em,strong等），则属于**内联盒子**。如果是个光秃秃的文字，则属于**匿名内联盒子**。

比如：文字、`<em>` 标签、图片、按钮，都属于内联盒子。

3. 行框盒子（line boxes）：每一行就是一个行框盒子。每个行框盒子又是由一个一个**内联盒子**（inline boxes）组成。

无论是 `<br/>` 换行还是 `<p>` 标签宽度不足导致的换行。两行就是两个行框盒子。

4. `<p>` 标签所在的**包含盒子**（containing box），此盒子由一行一行的**行框盒子**（line boxes）组成

可以理解为 block 水平模块的基本盒子。

> 了解行内框盒子模型，对理解 `line-height` 有什么现实意义？

### `line-height` 与内联元素的高度表现原理

```html
<p>这是一行普通文字，这里有个 <em>em</em> 标签。</p>
```

```js
console.log(document.querySelector('p').clientHeight)
```

> 元素的高度是如何来的？是不是由里面的元素撑开的？

#### 内联元素的高度是由 `line-height` 决定的。

```css
.test1 {font-size:36px; line-height:0; boder:1px solid #ccc; backgroud:#eee;}
.test1 {font-size:0; line-height:36px; boder:1px solid #ccc; backgroud:#eee;}
```

> `line-height` 是两条基线间的距离，单行文字怎么会有行高，如何控制的高度？

- 行高由于其继承性，影响无处不在，即使单行文本也不例外
- 行高只是幕后黑手，**高度的表现不是行高**，而是**内容区域**和**行间距**

只不过正好：

内容区域高度 `content area` + 行间距 `vertical spacing` = 行高 `line-height`

- **内容区域**高度只与字号以及字体有关，与 `line-height` 没有任何关系
- 在 `simsun` 宋体字体下，内容区域高度等于文字大小值。

即：font-size + 行间距 = line-height 。

举例：

```css
font-size: 240px;
line-height: 360px;
```

推算出：行间距 = 360 - 240 = 120px 。 **前提：在宋体 `simsun` 字体下**

- 行间距上下拆分，就有了“半行间距”。

![img640](http://olq0r66c9.bkt.clouddn.com/md/1516026868522.png)

总结：行高决定内联盒子高度，行间距可大可小（甚至负值），由于内容区域和行间距高度正好等于行高，所以看上去就像行高决定高度一样。

> 如果行框盒子里面有多个不同行高的内连盒子的行高怎样表现？
> 是由行高最高的那个盒子决定的。这种说法不严谨。

```html
<p>这是一行普通文字，这里有个 <em style="line-height:80px;">em</em> 标签。</p>
```

```html
<p>这是一行普通文字，这里有个 <em style="line-height:80px; vertical-align: 40px;">em</em> 标签。</p>
```

```js
console.log(document.querySelector('p').clientHeight)
```

含多个行框盒子的包含容器，多行文本的高度就是多行文本高度的累加

> 若行框盒子里面混入 `inline-block` 水平元素，比如：图片，高度如何表现？

## `line-height` 各类属性值的不同表现

`line-height: normal;` 默认值，各浏览器表现不同，和元素字体 `font-family` 有关。

Chrome 下实验：

![img754](http://olq0r66c9.bkt.clouddn.com/md/1516028071769.png)

![img700](http://olq0r66c9.bkt.clouddn.com/md/1516028092960.png)

由于 `normal` 这种不确定性，实际网页开发中，通常会在 `<body>` 进行 reset 初始化一个固定值，保证浏览器兼容性一致。

`line-height: <number>;` 使用数值作为行高，根据当前的 `font-size` 大小计算。

比如：

```css
font-size: 20px;
line-height: 1.5;
```

`line-height = 20px * 1.5 = 30px;`

`line-height: <length>;` 使用具体长度值作为行高。可以使用相对单位或固定单位，比如：`em|px|rem|pt` 。

`line-height: <percent>;` 使用百分比值作为行高。相对于设置了该 `line-height` 属性元素的 `font-size` 计算。

比如：

```css
font-size: 20px;
line-height: 150%;
```

`line-height = 20px * 150%= 30px;`

`line-height: inherit;` 行高继承 IE8+ 以上浏览器才识别。

`input` 默认的行高是 `normal`，不是继承父级的，所以需要设置继承重置一下。使用 `inherit` 可以让文本框样式可控性更强。

#### 1.5, 1.5em, 150%的区别

- 计算没有任何差别
- 应用元素有差别
1. 1.5 所有可继承元素根据 font-size 大小重计算行高。
2. 1.5em, 150% 当前元素根据 font-size 计算行高，继承给下面元素。

![img760](http://olq0r66c9.bkt.clouddn.com/md/1516029123240.png)

所以，一般使用数值重置行高。

#### `<body>` 全局数值行高重置使用经验

比如：博客，以阅读为主的行高至少 1.5 ~ 1.6

如果是面向用户的网页开发，推荐匹配 20px ，方便心算。

```css
body {font-size:14px; line-height: 1.42857(14...)}
```

line-height = 20px / 14px

可以使用 1.42857 吗？由于Chrome 浏览器向下取整，所以 1.42857 * 14px 不是 20px 约等于 19px 。所以，不能使用 1.42857 ，需要向上取整。

```css
body {font-size:14px; line-height: 1.4286}
```

### `line-height` 行高与图片样式的表现

> 行高会不会影响图片实际占据高度？

#### 隐匿文本节点

```html
<p style="text-align:center;">
    <img src="mm1.jpg" style="position: absolute;"/>
</p>
```
> 如何消除图片底部间隙？

1. 图片块状化 - 无基线对齐 `img {display:block;}`

`vertical-align` 只适用于内联和内联块状元素，块状元素没有基线对齐，自然不会因为基线对齐留有下面的空隙。

2.图片底线对齐 `img {vertical-align:bottom;}`

默认基线 `baseline` 对齐导致下面的空隙。

3.行高足够小 - 基线位置上移 `img {line-height:0;}`

行高变小，基线上移。

#### 小图片和大文字，图片后跟文字

基本上高度受行高控制，除 ie6 浏览器。

剩下就是图文 `vertical-align` 微调垂直对齐。

### `line-height` 实际应用

基本应用：单行文字垂直居中，间距设置等实现不探讨。

#### 大小不固定图片、多行文字垂直居中

- 图片水平、垂直近似居中

```css
.box {
    .box {line-haight:300px;text-align:center;}
    .box > img {vertical-aling:middle;}
}
```

`vertical-aling:middle;` 不是绝对居中，是基线往上 1/2X 的高度。IE8+ 支持。

#### 多行文本水平垂直居中

```css
box{line-height: 250px; text-align: center;}
.box > .text{display: inline-block; line-height: normal; text-align: left; vertical-align: middle; max-width: 100%;}
```

多行文字水平垂直居中实现的原理跟图片的实现原理是一样的，区别在于要把多行文本所在的容器 `display` 水平转换成和图片一样的，也就是`inline-block`（`<img>` 默认就是 `inline-block` 内联块状元素），以及重置外部继承的 `text-align` 和 `line-height` 属性值。IE8+ 支持。

#### `line-height` 代替 `height` ,避免 IE6/IE7 下的 haslayout

IE6, IE7 下元素设置高度属性 `height` ，会使元素有 haslayout ，而设置行高属性 `line-height` 没有 haslayout

一旦元素有了 haslayout ，会冲破父容器，比如：`float:left` `display:inline-block;` 宽度自适应的限制会被破坏。包裹性会受到破坏。

![img716](http://olq0r66c9.bkt.clouddn.com/md/1516111440544.png)

![img880](http://olq0r66c9.bkt.clouddn.com/md/1516111461638.png)

自适应情况，建议 `line-height` 代替 `height` 。

```css
.div { height:36px;  line-height36px;}
```

所以，上面代码，`height` 是多余的。






基线（baseline）是西文字体设计与排版的概念，源自西文字母的主体底部对齐的位置。
汉字以一字见方的正方形框架为基准定位，笔画在字框内居中并充满字框，原则上并不存在基线，只有字框和字框中心。
但大陆与日本的横排标点都居左下，于是实际上可以分析出一条「汉字基线」：像西文字母坐在基线上一样，汉字和标点符号也都坐在汉字基线上。汉字基线比汉字字面的下边缘要高。

行高 = 第一行基线到第二行基线距离

行高在实际中没有使得元素垂直居中，除非字体大小为0。

1，行高，基线，主要说明基线的问题是行高的标志
2.解释了行内框盒子模型效果， 内容区域，内联盒子，行内盒子，包含盒子。
3，line-height 高度机理 ，，行高==内容区域+行间距；内容区域=字号+字体（字体为宋体）；
4，line-height的各种属性，normal，默认属性和浏览器和字体有关系，number，根据font-size有关系，length，直接固定具体长度大小（px，pt，em。。。），percent，百分比，inherit继承关系（这个章节主要说明了一下百分比和数值的关系，还不是很清楚，需要在看其他资料自己了解）；
5，body全局数值行高的经验，body｛font-seiz：14px；line-height：1.4286｝是根据20字号下的宋体进行得出来的结论，再次用到了数值和百分比的关系。
6，解决图片下面有空白的bug三种解决方法，图片块状话，图片底线对其，行高为零，
7，line-height的实际应用，图片居中，多行居中，line-height和height的关系。
少数字体会显示如图

计算机内字母文字等相关字符的显示，是有一条基线的。基线是所有线的基础，都是相对基线的。不同字体，其实离基线的距离是不一样的，行高的基线在中间，设置行高line-height本质上并没有让内容垂直居中，只有字体大小为0px的时候才真正居中，只是肉眼看不出来而已