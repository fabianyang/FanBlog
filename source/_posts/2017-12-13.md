---
title: 判断元素是否进入了视窗
categories:
- JavaScript
tags:
- IntersectionObserver
- getBoundingClientRect
date: 2017-12-08 15:04:51
---

### 传统判断方式

#### 1.1 元素位置及视窗宽高

##### 1.1.1 MDN 解释

![](/img/2017-12-13-offsetLeft.jpg)

offsetTop,offsetLeft: 只读属性。要确定的这两个属性的值，首先得确定元素的 offsetParent 。

offsetParent: 指的是距该元素最近的 position 不为 static 的祖先元素，如果没有则指向 body 元素。

确定了 offsetParent 。 offsetLeft 指的是元素左侧偏移 offsetParent 的距离，同理 offsetTop 指的是上侧偏移的距离。

![](/img/Dimensions-offset.png)

offsetHeight,offsetWidth: 只读属性。这两个属性返回的是元素的高度或宽度，包括元素的 边框、内边距和滚动条 。返回值是一个经过四舍五入的整数。

![](/img/153120w8lq2rlrorvvczcr.png)

scrollHeight,scrollWidth: 只读属性。返回元素内容的整体尺寸，包括元素看不见的部分（需要滚动，元素需要超出容器）。返回值包括 padding ，但不包括 margin 和 border 。

scrollTop,scrollLeft: 如果元素没有滚动，则为0。

window.innerWidth,window.innerHeight: 只读。视口（viewport）的尺寸，包含滚动条。

![](/img/Dimensions-client.png)

clientHeight,clientWidth: 包括 padding ，但不包括 border, margin 和滚动条 。

##### 1.2.2 实例验证

实验：
```html
<textarea id="tt" wrap="on"></textarea>
```
```js
document.getElementById('tt').onclick= function() {
    alert(
        ' scrollWidth:' + this.scrollWidth +
        '\n scrollHeight:' + this.scrollHeight +
        '\n offsetWidth:' + this.offsetWidth +
        '\n offsetHeight:' + this.offsetHeight +
        '\n clientWidth:' + this.clientWidth +
        '\n clientHeight:' + this.clientHeight
    );
}
```

效果：点击 textarea 弹出了这个元素的六个对象的值。

`wrap="on"` 指的是开启换行，这会影响到有无滚动条，从而查看 scrollWidth/scrollHeight 和 clientWidth/clientHeight 的变化。

结论：

`scrollWidth` 指的是对象实际内容的宽度

`clientWidth` 指的是对象可见内容的宽度（不算边框和滚动条）

`offsetWidth` 指的是对象看到的宽度（包括边框和滚动条）

注意：各个浏览器对可视区域的解释和获取方式并不一致。请查看 [clientWidth offsetWidth innerWidth 区别(窗口尺寸 汇总）](http://www.cnblogs.com/youxin/archive/2012/09/21/2697514.html) 。

![](/img/JSCoordinate3.jpg)

灰色的大背景 `Document` 是整个网页的全部尺寸，中间的 `Browser` 是我们浏览器的宽高。
`DIV element client area` 是这个 div 元素的可见区域，是实际占据网页尺寸空间（不算边框和滚动条）。
`DIV element scroll area` 是这个 div 内容原始尺寸，但是由于 div 的 css 所设置的高度宽度容不下它的内容，所以出现滚动条。

最下面三条线，黑色的是 `clientWidth` 表示对象可见内容的宽度，蓝色的是 `offsetWidth` 表示包含边框和滚动条的对象宽度，红色的是 `scrollWidth` 表示对象的实际宽度。

从 `DIV element client area` 的边一直到整个文档的最上端，都是 `offsetTop` 。 `offsetLeft` 是元素到文档的最左端。

所以:

`offsetLeft`,`offsetTop`: 表示对象的上边距/左边距相对于文档最顶端或最左端的距离。

`scrollTop`,`scrollLeft`: 表示的是对象的上边距/左边距相对于实际区域的最顶端或最左端的距离（换句话说就是被卷进去的长度）。

##### 1.1.3 判断元素是否在可视区域

```js
function (el) {
    // 获取div距离顶部的偏移量
    var offset = el.offsetTop;
    // 获取屏幕高度
    var windowInner = window.innerHeight;
    // 屏幕卷去的高度
    var bodyScroll = document.body.scrollTop;
    if( windowInner + bodyScroll > offset ) {
        alert("已经进入可视区");
    } else {
        alert("并没有进入可视区");
    }
}
```
注意：IE 不支持 window.innerWidth,window.innerHeight 属性。它用 document.documentElement 或 document.body （与 IE 的版本相关）的 clientWidth 和 clientHeight 属性作为替代。

#### 1.2 `getBoundingClientRect` 获取元素位置

![](/img/2017-12-13-rect.png)

##### 1.2.1 [MDN 解释](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)
`Element.getBoundingClientRect()`: 只读，返回浮点值。

这个方法非常有用，常用于确定元素相对于视口的位置。该方法会返回一个 DOMRect 对象，包含 left,top,width,height,bottom,right 六个属性。

left,right,top,bottom: 都是元素（不包括 margin ）相对于视口的原点（视口的上边界和左边界）的距离。

height,width: 元素的整体尺寸，包括被滚动隐藏的部分。padding 和 border 参与计算。heigth=bottom-top,width=right-left

##### 1.2.2 兼容性
`getBoundingClientRect()` 最先是IE的私有属性，现在已经是一个 W3C 标准。所以不用当心浏览器兼容问题，不过还是有区别的。

IE10 只返回 top,lef,right,bottom 四个值。兼容写法：

```js
// 兼容所有浏览器写法：
var ro = object.getBoundingClientRect();
var Top = ro.top;
var Bottom = ro.bottom;
var Left = ro.left;
var Right = ro.right;
var Width = ro.width || Right - Left;
var Height = ro.height || Bottom - Top;
```

##### 1.2.3 判断元素是否在可视区域
```js
function isElementInViewport (el) {
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
```
注意：这里 window.innerHeight 的兼容性问题。

### jQuery lazyLoader 判断方法

类似上面的两种方式都有或多或少的兼容性问题，jQuery 把这些获取宽高的方式已经做了兼容处理，所以还是推荐使用强大的 jQuery 。

通过 lazyLoader 源码可以看到
```js
$.inviewport = function (element, settings) {
    return !$.rightoffold(element, settings)
        && !$.leftofbegin(element, settings)
        && !$.belowthefold(element, settings)
        && !$.abovethetop(element, settings);
};
```

判断逻辑基本类似，都是判断元素的上下左右是否在窗口中。

将此代码放到容器的 scroll 事件中，就可以实时判断元素是否出现在视窗内了。

具体以判断是否在视窗右边举例，源码：

```js
// 在视口右方
$.rightoffold = function (element, settings) {
    let fold;

    if (settings.container === undefined || settings.container === window) {
        fold = jqWin.width() + jqWin.scrollLeft();
    } else {
        fold = $(settings.container).offset().left + $(settings.container).width();
    }

    return fold <= $(element).offset().left - settings.threshold;
};
```

解析：
1、如果外层容器 (offsetParent) 是 window 的话，获取 window 的宽度和向右滚动的距离。
2、如果不是 window 为外层容器，那么计算出外层右侧距离 window 左边的距离。
3、结果和当前元素的左边进行比较，判断是否在视口右边。

其中，`settings.threshold` 只是一个阈值，加大或缩小判断范围

### IntersectionObserver API

##### 1.1 兼容性

![img](http://olq0r66c9.bkt.clouddn.com/md/1513151453905.png)

至于是否使用这个 API ，个人建议了解就好，虽然已经是 [w3c](https://www.w3.org/TR/2017/WD-intersection-observer-20170914/) 推荐 API ，但浏览器实现不太乐观。

##### 1.2 [MDN 解释](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver)

这个 API 为开发者提供了一种可以异步监听目标元素与其祖先或视窗 (viewport) 交叉状态的手段。

祖先元素与视窗(viewport)被称为根(root)。

由于可见（visible）的本质是，目标元素与视口产生一个交叉区，所以这个 API 叫做"交叉观察器"。

##### 1.3 判断元素是否在可视区域

"惰性加载" 实现变得简单了

```js
function query(selector) {
  return Array.from(document.querySelectorAll(selector));
}

var observer = new IntersectionObserver(
  function(changes) {
    changes.forEach(function(change) {
      var container = change.target;
      var content = container.querySelector('template').content;
      container.appendChild(content);
      observer.unobserve(container);
    });
  }
);

query('.lazy-loaded').forEach(function (item) {
  observer.observe(item);
});
```

只有目标区域可见时，才会将模板内容插入真实 DOM，从而引发静态资源的加载。

##### 1.4 注意点

IntersectionObserver API 是异步的，不随着目标元素的滚动同步触发。

规格写明，IntersectionObserver 的实现，应该采用 requestIdleCallback() ，即只有线程空闲下来，才会执行观察器。这意味着，这个观察器的优先级非常低，只在其他任务执行完，浏览器有了空闲才会执行。

至于这一点有待验证。

### 总结

以上讲述了如何判断元素是否出现在视窗内的几种方法，其实原理大同小异。

都是判断当前元素的位置同时获取视窗的大小，上下左右比较，来确定是否在视窗内。

除了新的 API, 其他的方法实现的关键都在于理解以下问题：
1. 视窗获取宽高的方法、了解宽高属性(clientWidth,clientHeight,offsetWidth,offsetHeight,scrollWidth,scrollHeight)的细节。
2. 当前元素定位的属性，left,right,top,bottom(offsetLeft,offsetTop) 是相对于 offsetParent 计算的。

个人推荐理解 lazyLoader 源码，可以借以实用。


### 相关参考
> [图示offsetWidth clientWidth scrollWidth scrollTop scrollLeft等属性的细微区别](http://www.cnblogs.com/LongWay/archive/2008/07/19/1246465.html)
>
> [scrollWidth,clientWidth和offsetWidth的不同](http://blog.csdn.net/taotao6039/article/details/17917537)
>
> [getBoundingClientRect判断元素是否可见](http://div.io/topic/1400)
>
> [详解页面滚动值scrollTop在FireFox与Chrome浏览器间的兼容问题](http://www.jb51.net/article/75836.htm)
>
> [IntersectionObserver API 使用教程](http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html)
>
> [IntersectionObserver’s Coming into View](https://developers.google.com/web/updates/2016/04/intersectionobserver)
>
> [IntersectionObserver API 详解](http://www.cnblogs.com/ziyunfei/p/5558712.html)