# JavaScript 内存泄露

## 什么是内存泄露

程序的运行时，没有及时释放无用的存储空间，导致内存越用越多，产生内存泄露（memory leak）。

JavaScript 通过 “**垃圾回收机制**”（garbage collector），自动管理内存。

**错误印象**：JavaScript 拥有垃圾回收机制，自动释放内存，可以不去关心内存管理。

## 垃圾回收机制原理

### 引用计数

引用计数：通俗讲就是跟踪记录每个值被引用的次数。

如果存在某个引用类型变量，引用计数（即：指向该变量的指针个数）不为 0 ，无法释放，会容易导致内存泄漏。

### 标记清除

利用二叉树标记引用对象，设置全局变量 `window` 为根，递归检查子变量，能够从根到达的会被标记为活跃对象。

如果没有被 `window` 对象上任何对象引用，会认为不可到达，进行释放。

![img](http://olq0r66c9.bkt.clouddn.com/md/1518157335707.png)

## 常见的内存泄漏

### 循环引用

1. JS Object 循环引用

```js
function f() {
    var o1 = {};
    var o2 = {};
    o1.p = o2;
    o2.p = o1;
}

f();
```

这种循环引用，如果采用引用计数方式进行垃圾回收的话，由于指针相互指向，`o1` `o2` 计数最少为 1，所以无法回收。

但如果采用标记清除方式进行垃圾回收，`f()` 执行完成后，`window` 对象不会再持有 `f()` 的引用，进而也就不会查找到达 `o1` `o2`，会进行回收。

2. JS 对象和 DOM 对象循环引用

```js
var element = {
  image: document.getElementById('image'),
  button: document.getElementById('button')
};

document.body.removeChild(document.getElementById('image'));
```

这种方式，DOM 持有对 DOM 节点的引用，JS 对象同时也指向了同一个 dom 节点，虽然从 DOM 树中移除了 dom 但依然被一个 JS 对象所引用。

所以，此时该 dom 并没有被垃圾回收机制所回收。

解决方式：手动删除 dom 对象引用，置为 `null` 。

### 闭包

由于闭包内部函数有权访问外部函数的变量对象，所以内部函数持有外部函数局部变量，使其得不到释放。
```js
function fn() {
    var jsObj = document.getElementById('box');
    jsObj.oncontextmenu = function () {
        return false;
    };
}
```
解决方式：将事件处理函数定义在外部，解除闭包。或者在定义事件处理函数的外部函数中，删除对 dom 的引用。

### 意外全局变量

```js
function foo(arg) {
    bar = 'some text';
    this.arg = arg;
}
foo();
```

解决方式：使用严格模式 `'use strict'`

### 被遗忘的定时器或者回调

定时器中有 dom 的引用，即使 dom 删除了，但是定时器还在，所以内存中还是有这个 dom 。

解决方式：手动删除定时器和 dom 。

### 子元素存在引用

`<div>` 中包含 `<ul>` `<li>` 。如果直接引用 `li` ，此时即使删除 `div`，由于 `li` 被引用，所以父级 `<div>` 也不会被回收。

解决：手动删除被引用的子元素。

## 总结

1. 小心使用全局变量，尽量不要使用全局变量来存储大量数据，如果是暂时使用，要在使用完成之后手动指定为 null 或者重新分配。
2. 如果使用了定时器，在无用的时候要记得清除，最好用完就清除。

```js
let timer = setTimeout(function() {
    var dom = document.getElementById('dom');
    console.log(dom.id);
    clearTimeout(timer);
}, 1000);
```

3. 如果为 DOM 节点绑定了事件监听器，在移除节点时要先注销事件监听器。
4. 小心闭包的使用。递归中容易很自然的就使用了闭包。
5. 在移除 DOM 节点的时候要确保在代码中没有对节点的引用。
6. 在移除父节点之前要先移除子节点的引用。


> 参考

[JavaScript是如何工作的：内存管理 + 如何处理4个常见的内存泄漏(译)](https://juejin.im/post/59ca19ca6fb9a00a42477f55)

[JavaScript 内存泄漏教程](http://www.ruanyifeng.com/blog/2017/04/memory-leak.html)

[JavaScript对象循环引用与闭包导致的内存泄漏及其解决方案](http://www.zymseo.com/306.html)

[js垃圾回收机制和引起内存泄漏的操作](http://blog.csdn.net/yingzizizizizizzz/article/details/77333996)

[js垃圾回收机制](http://blog.csdn.net/luoshengmenwh/article/details/52751203)

[1]: https://github.com/ruanyf/articles/blob/master/2017/2017-04-16-memory-leak.md