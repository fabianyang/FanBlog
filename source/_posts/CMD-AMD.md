---
title: CMD AMD
categories:
- JavaScript
tags:
- CMD
- AMD
- CommonJS
date: 2018-02-13 15:04:51
---

## 前言

模块化编程已经用了很久了，但是依旧对 `CMD` `AMD` `CommonJS` 等概念混淆，所以总结一下加深印象。

## 模块化

模块化就是将功能进行封装，引入模块就可以使用模块里面的方法来实现想要的业务逻辑。

即：模块就是实现特定功能的一组方法。

Javascript 本身不是一种模块化编程语言，因为它没有类的概念，一切皆为对象 `Function` 。但利用 JS 的语言特性也可以模拟模块开发。

比如：字面量一个 `Object` 进行方法封装，或者更好的方式是，使用立即执行函数形成闭包，暴露对象方法。

为了规范模块化开发写法，通行规范是 **CommonJS** 和 **AMD** 。

## CommonJS

CommonJS 就是为 JS 的表现来制定规范， NodeJS 模块系统是这种规范的实现， webpack 也是以 CommonJS 的形式来书写。

CommonJS Modules/2.0 规范，是 BravoJS 在 NodeJS 推广过程中对模块定义的规范化产出。

因为 JS 没有模块的功能，所以 CommonJS 应运而生，NodeJS 希望 JS 可以在任何地方运行，不只是浏览器中。

因为在服务器端，一定要有模块，与操作系统和其他应用程序互动，否则根本没法编程。

NodeJS 的终极目标是提供一个类似 Python，Ruby 和 Java 标准库。

[CommonJS WIKI](http://en.wikipedia.org/wiki/CommonJS) 讲了 CommonJS 的历史，还介绍了 modules 和 packages 等。

CommonJS 定义的模块分为: **模块引用(require)**、**模块定义(exports)**、**模块标识(module)**

- require() 用来引入外部模块
- exports 对象用于导出当前模块的方法或变量，唯一的导出口
- module 对象就代表模块本身。

而浏览器不兼容 CommonJS 的根本原因，就是缺少了这三个关键变量。

```js
// 模拟CommonJS
var module = {
  exports: {}
};

(function(module, exports) {
  exports.multiply = function (n) { return n * 1000 };
}(module, module.exports))

var f = module.exports.multiply;
f(5) // 5000
```

虽然浏览器 JS 模块化解决方案可以进行模拟，但仍然还是有问题。

Node 主要用于服务器的编程，加载的模块文件一般都已经存在本地硬盘，所以加载起来比较快，不用考虑异步加载的方式，CommonJS 加载模块是同步的，所以只有加载完成才能执行后面的操作。

但是浏览器环境不同于 Node ，浏览器中获取一个资源必须要发送 HTTP 请求，从服务器端获取，采用同步模式必然会阻塞浏览器进程出现假死现象。

所以为了无阻塞加载脚本方式在开发中广泛应用，结合 CommonJS 规范，前端模块化迎来了两种方案：AMD、CMD.

## AMD / CMD

AMD (Asynchronous Module Definition) 异步模块定义： 是 RequireJS 在推广过程中对模块定义的规范化产出。出自 dojo 加载器的作者 James Burke 。

CMD (Common Module Definition) 通用模块定义：是 SeaJS 在推广过程中对模块定义的规范化产出。出自国内前端大师玉伯。

目前，这两种规范的都能达成浏览器端模块化开发的目的。

### 区别

1. 对于依赖的模块，**AMD 是提前执行，CMD 是延迟执行**。不过 RequireJS 从 2.0 开始，也改成可以延迟执行（根据写法不同，处理方式不同）。CMD 推崇 *as lazy as possible.*

2. CMD 推崇依赖就近，AMD 推崇依赖前置。看代码：

```javascript
// CMD
define(function(require, exports, module) {
    var a = require('./a')
    a.doSomething()
    // 此处略去 100 行
    var b = require('./b') // 依赖可以就近书写
    b.doSomething()
})

// AMD 默认推荐的是
define(['./a', './b'], function(a, b) { // 依赖必须一开始就写好
    a.doSomething()
    // 此处略去 100 行
    b.doSomething()
})
```

虽然 AMD 也支持 CMD 的写法，同时还支持将 require 作为依赖项传递，但 RequireJS 的作者默认是最喜欢上面的写法，也是官方文档里默认的模块定义写法。

3. AMD 的 API 默认是一个当多个用，CMD 的 API 严格区分，推崇职责单一。比如 AMD 里，require 分全局 require 和局部 require，都叫 require。CMD 里，没有全局 require，而是根据模块系统的完备性，提供 seajs.use 来实现模块系统的加载启动。CMD 里，每个 API 都简单纯粹。

> [AMD 规范](https://github.com/amdjs/amdjs-api/wiki/AMD)
>
> [CMD 规范](https://github.com/seajs/seajs/issues/242)

另外，可以参考：[SeaJS 和 RequireJS 的差异](https://github.com/seajs/seajs/issues/277)、[SeaJS 与 RequireJS 的最大异同](http://www.douban.com/note/283566440/)

## 总结

1. AMD 和 CMD 都是异步的，适合浏览器中模块化开发。

2. 都是提前加载，AMD 是预执行，CMD 是延迟执行。

3. 注意：**CMD 不是 CommonJS 规范**！！最重要区别：CommonJS 是同步加载， CMD 是异步加载。

4. CommonJS 是服务器端模块化解决方案，AMD 和 CMD 是浏览器模块化解决方案。

PS: CMD 可能是由于国内推广的规范原因，所以国外关注度并不高。但个人感觉还是 SeaJS 比较好用的。

5. ES6 模块 Module 不属于任何一种规范。必须文件开头 `import` 。

> ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。

## 参考

> [AMD 和 CMD 的区别有哪些？](https://www.zhihu.com/question/20351507/answer/14859415)
>
> [彻底弄懂CommonJS和AMD/CMD！](http://www.cnblogs.com/chenguangliang/p/5856701.html)
>
> [以代码爱好者角度来看AMD与CMD](https://www.cnblogs.com/dojo-lzz/p/4707725.html)
>
> [Javascript模块化编程（一）：模块的写法](http://www.ruanyifeng.com/blog/2012/10/javascript_module.html)
>
> [Javascript模块化编程（二）：AMD规范](http://www.ruanyifeng.com/blog/2012/10/asynchronous_module_definition.html)
>
> [浏览器加载 CommonJS 模块的原理与实现](http://www.ruanyifeng.com/blog/2015/05/commonjs-in-browser.html)
>
> [ES6 Module](http://es6.ruanyifeng.com/#docs/module#%E6%A6%82%E8%BF%B0)