---
title: WebWorker 多线程
categories:
- JavaScript
tags:
- Worker
date: 2017-02-02 15:04:51
---

## 前言

在做多页面通信时，有一种错误的想法，就是使用 `Worker` 解决跨窗口通信，后来研究发现，其实是行不通的。即使创建了一个线程，也只能和主线程进行通信，没有办法子线程间进行通信。

使用 **`SharedWorker` 兼容性太差**了。

## [WebWorker 是什么](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)

Web Worker 为 Web 内容在后台线程中运行脚本提供了一种简单的方法。线程可以执行任务而不干扰用户界面。

## 为什么要出现 Web Worker

JavaScript 的一大特点就是单线程，同一个时间只能做一件事。

为了利用多核 CPU 的计算能力，HTML5 提出 Web Worker 标准，允许 JavaScript 脚本创建多个线程，但是子线程完全受主线程控制，且不得操作 DOM 。

所以，这个新标准并没有改变 JavaScript 单线程的本质。

## 使用场景

当一个页面加载了大量的 JS 文件时，用户界面可能会短暂地假死。

如果一段 JS 中出现了死循环，这时再去点击页面的 DOM 元素，将不会触发事件，因为 JS 的 `Event Loop` 机制，导致 JS 事件或者浏览器渲染等事件排成了队列，线程无空闲执行后续事件，导致代码阻塞，浏览器出现卡顿现象。

所以，当大量运算时，比如：大数据项目，前端负责了大量计算，排序等逻辑。或者，一个请求费时的 AJAX 。将它们放到 Worker 中，主线程尽可能只专注于界面渲染，那么用户体验会大大提高。


## 使用方式

Web Worker 是在主线程中通过传入一个 js 文件的路径来实现的，它返回一个 Web Worker 的实例对象，该对象是主线程与该线程通信的桥梁。

```js
// 创建一个 Worker 线程
let worker = new Woker ('worker.js');
```

主线程和子线程实现通信

```js
// 监听一个线程向另一个发送的消息并执行指定方法
// event.data 为接受到的数据
onmessage = (event) => {
      console.log(event.data);
}
// 一个线程向另一个线程发送消息
postMessage(data)
```

终止 Web Worker

```js
worker.terminate()
```

错误监听

```js
worker.addEventListener('error', (e) => {
    console.error(e.filename) // 导致错误的 worker 脚本名称
    console.error(e.message) // 错误信息
    console.error(e.lineno) // 错误行号
})
```

## 简单举例

```js
/**
 * main thread
 */
let worker = new Worker ('worker.js')
worker.onmessage = (e) => {
  console.log(e.data) // I post a message to main thread
}
worker.postMessage('main thread got a message')

/**
 * child thread worker.js
 */
onmessage = (e) => {
    console.log(e.data) // main thread got a message
}
postMessage('child post a message to main thread')
```

## 总结

兼容性：ie10+ 浏览器支持，Chrome 可以调试。

1. Worker 所执行的 Javascript 代码完全在另一个作用域中，全局对象是 `self` ， `this` 和 `self` 引用的都是 Worker 对象本身。
2. 通过 Worker 创建的线程的运行环境中没有全局对象 `window`，也无法访问 DOM / BOM 对象。
3. Worker 中数据的接收与发送。除了 ArrayBuffer 其他都是拷贝传递，所以，即使把 DOM 传递到子线程，也是拷贝，操作也无法影响主线程 DOM 结构。
4. Api 支持很少。`console.log(self)` 打印看看
      - XMLHttpRequest
      - setTimeout/setInterval
      - importScripts
      - addEventListener/postMessage
      - navigator/location (read only)
      - Promise
5. Worker 在实例化的时候必须要传入一个脚本 URL，而且必须是在本域下，否则会报跨域错误。但可以在 Worker 里通过 importScripts 方法引入任何域下的脚本。

## 参考
> [WebWorker是什么鬼？](http://mdsa.51cto.com/art/201511/497002.htm)
>
> [使用 webWorker 实现多线程](https://zhuanlan.zhihu.com/p/29219879)
>
> [WebWorker实战使用](http://www.cnblogs.com/dojo-lzz/p/7899283.html)
>
> [深入分析HTML5 Web Worker是利器还是摆设](https://yq.aliyun.com/ziliao/25009)
>
> [Did anyone use WebWorkers already with WebPack and Vue.js?](https://github.com/israelss/vue-worker)
>
> [深入 HTML5 Web Worker 应用实践：多线程编程](https://www.ibm.com/developerworks/cn/web/1112_sunch_webworker/)