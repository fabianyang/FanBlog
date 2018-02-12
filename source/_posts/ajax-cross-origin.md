---
title: AJAX 跨域
categories:
- JavaScript
tags:
- CORS
date: 2017-02-02 15:04:51
---

## 前言

前端开发肯定对“跨域”这个名词并不陌生，经常 Ajax 请求时，Network 工具 Http 状态码 200 并返回了数据，但正确回调并没有执行并 catch 到了错误。

网上的关于跨域的问题，说的已经够多了。这里只是个人进行一次总结，整理工作中的解决方案。

## 1 为什么产生跨域？

### 同源政策

简单来讲，浏览器规定协议、域名、端口都相同的的两个网页，才属于同源网页。

注意：这是规定，而且是浏览器厂商约定俗成规定的。

目的：很简单，保证用户信息安全，防止恶意窃取数据。

比如：登录银行网站，Cookie 包含登录信息。如果没有同源政策，其他网站拿到这个 Cookie 就可以模拟进行数据请求，做想做的事~

限制：Cookie, Storage 等无法读取，DOM 不能访问，请求返回后报错。

## 2 Cookie 同源共享

- 两个网页一级域名相同，只是二级域名不同，浏览器允许通过设置 `document.domain` 共享 Cookie 。

- 服务器在设置 Cookie 时，指定 Cookie 的所属域名为一级域名，二级域名和三级域名不用做任何设置，都可以读取这个 Cookie 。

比如： `Set-Cookie: key=value; domain=.example.com; path=/`

## 3 iframe DOM 访问或数据交互

`iframe` 和 `window.open` 打开的窗口，它们与父窗口无法通信。

父窗口想获取子窗口的 DOM ，因为跨源导致报错。

```js
document.getElementById("myIFrame").contentWindow.document
// Uncaught DOMException: Blocked a frame from accessing a cross-origin frame.
```

和 Cookie 相同，如果只有二级或三级域名不同，设置 `document.domain` 相同，可以拿到 DOM。

#### 数据交互

- fragment identifier: 片段标识符，父窗口通过设置子窗口 url 的 hash 值更改数据，子窗口通过轮训 `location.hash` 变化获取数据。

- `window.name`: 请求目标地址，设置 `window.name` ，请求目标页面时 `window.name` 已经设置成功，iframe 再请求一个同源地址。由于 `window.name` 无论是否同源，只要在同一个窗口里，前一个网页设置了这个属性，后一个网页可以读取它。所以，此时父子窗口同源，父窗口可以访问子窗口 `window.name` 获取数据。

- `window.postMessage`: H5 API => 跨文档通信（Cross-document messaging）。允许跨窗口通信，不论这两个窗口是否同源。

```js
// parent postMessage to child
var popup = window.open('http://bbb.com', 'title');
popup.postMessage('Hello World!', 'http://bbb.com');
```

```js
// child postMessage to parent
window.opener.postMessage('Nice to see you', 'http://aaa.com');
```

`postMessage` 方法的第一个参数是具体的信息内容，第二个参数是接收消息的窗口的源（origin）。

```js
// parent or chlid listen 'message' event
window.addEventListener('message', function(evt) {
  // message content
  console.log(evt.data);
  // message from which window
  console.log(evt.source);
  // message target url
  console.log(evt.origin);
},false);
```

通过 `window.postMessage` ，读写其他窗口的 `LocalStorage` 也成为了可能。

## AJAX 同源规避

1. 架设服务器代理

原理：先访问同源同源服务器，同源服务器再请求外部服务器获取数据后，再返回给调用方法。这种方式实际还是属于访问同源地址。

PS: 现在基本使用 node 进行代理请求。

2. JSONP 不受同源政策限制

基本思想：在 html 页面中通过相应的标签从不同域名下加载静态资源文件是被浏览器允许的。网页通过添加一个 `<script>` 元素，向服务器请求 JSON 数据，服务器收到请求后，将数据放在一个指定名字的回调函数里传回来。

注意：请求查询字符串必须有一个 `callback` 参数指定回调函数名称。数据将放在回调函数的参数位置返回并立即执行。并且

原理：生成 `<script>` 插入 `<body>` 指定 src 地址，没有设置请求头的余地，并且 `<script>` 的 `src` 属性是没有跨域限制，等同于在 `<script>` 中执行脚本。所以， JSONP 只支持 `Get` 请求。

![img](http://olq0r66c9.bkt.clouddn.com/md/1516246170237.png)

3. WebSocket 通信协议不实行同源政策

原理：请求头 `Origin` 字段，表示该请求的请求源（origin），服务器可以根据这个字段，判断是否许可本次通信。所以 WebSocket 没有实行同源政策。

4. CORS 是跨源资源分享（Cross-Origin Resource Sharing）

它是 W3C 标准，是跨源 AJAX 请求的根本解决方法。允许任何类型的请求。

## 工作中使用的跨域解决方案

### document.domain + iframe 创建 ajax 代理

比如：`a.fang.com/a.html` 要向 `b.fang.com/b` 发送请求数据，不同域名，出现跨域。

1. 设置 `a.fang.com/a.html` 的 `document.domain`

```js
document.domain = 'fang.com';
```

注意：`document.domain` 只能设置与主域相同的值, 否则会报错。

```
Uncaught DOMException: Failed to set the 'domain' property on 'Document': 'x.com' is not a suffix of 'a.fang.com'.
```

2. 动态创建 `iframe` 并加载网页，获取代理 `XMLHttpRequest` 对象
```js
var xhr;
function getAjaxProxy(iframe) {
  var doc = iframe.contentDocument || iframe.contentWindow.document;
  if (doc && doc.readyState && doc.readyState == "complete") {
      var getXhr = iframe.contentWindow.getXhr || iframe.getXhr;
      if (typeof getXhr === 'function') {
          xhr = getXhr();
      } else {
          // error
      }
  } else {
      setTimeout(function () {
          getAjaxProxy(iframe);
      }, 100);
  }
}

var frame = $('<iframe src="http://b.fang.com/ajaxproxy.html" style="display:none"></iframe>');
$(document.body).append(frame);
var iframe = frame.get(0);
iframe.onload = function () {
    getAjaxProxy(iframe);
};
```

执行结果，返回页面内容如下：

```html
<iframe src="http://b.fang.com/ajaxproxy.html" style="display:none">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<script>
document.domain = 'fang.com';
// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}
function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}
function getXhr() {
    var xhr = window.ActiveXObject !== undefined ?
	// Support: IE6+
	function() {
		return createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;
	return xhr;
}
</script>
</head>
<body>ajaxproxy</body>
</html>
</iframe>
```

上面代码，请求的页面中，只定义了 `createStandardXHR()` 方法，返回了一个新的 `XMLHttpRequest` 对象。

注意：要设置与父级 `document.domain` 相同的值。

3. jQuery 进行代理请求，跨域请求完成。
```js
$.ajax({
  xhr: xhr,
  url: 'b.fang.com/b',
  method: 'POST',
  dataType: "json",
  data: obj
}).done(function(data) {
  console.log(data);
}).fail(function(error) {
  console.log(error);
});
```

总结：这种方式利用的是更改 `XMLHttpRequest` 请求源，让 `b.fang.com` 接收到的是 `iframe` 发出的同源请求，其实是 `a.fang.com` 所模拟的跨域请求。

### form submit + iframe action + post 302 back 跨域上传

比如：`a.fang.com/a.html` 要向 `b.fang.com/b` 上传文件并获取对应路径，不同域名，出现跨域。

1. 创建 `iframe` `form`，声明回调方法。
```html
<form id='ff' enctype="multipart/form-data" action="" method="get" target="">
  <input name="file_63fe5u" type="file" title="">
</form>
<iframe id="file_63fe5u" style="visibility:hidden"></iframe>
```
```js
document.domain = 'fang.com'
window.uploadComplete = function(imgUrl) {
  console.log(imgUrl);
}
```

2. `form` 提交文件到文件服务器，但返回内容返回到对应的 `iframe`
```js
var backUrl = 'http://c.fang.com/c';
var uploadUrl = 'http://b.fang.com/b?backurl=' + backUrl;
var ff = $('#ff');
ff.attr({
    'action': uploadUrl,
    'encoding': 'multipart/form-data',
    'target': 'file_63fe5u',
    'method': 'post'
}).submit();
```

注意：添加 `backurl` 参数只是因为公司文件服务器只负责返回到指定 `backUrl` 路径，不负责进行 `html` 生成。所以添加一个中间接口中转，生成所需要的 `html` 片段。所以，如果文件服务器接口可以返回所需要的 `html` 片段，`backUrl` 可省略。

3. 返回 `html` 片段执行回调方法。
```html
<html xmlns="http://www.w3.org/1999/xhtml"><head>
    <meta http-equiv="Content-Type" content="text/html; charset=gbk">
    <title>uploadimgcallback</title></head><body><br>
    <script>
        document.domain = 'fang.com';
        !(function(win){
            if(win.parent) win.parent.uploadComplete('http://b.fang.com/2018_01/24/13/1516773408031_000.jpg');
        })(window);
    </script>
<div>http://b.fang.com/2018_01/24/13/1516773408031_000.jpg</div>
</body></html>
```

总结：这种方法利用的是 `form` 表单可以指定提交到 `iframe` ，`iframe` 设置为非跨域，执行父级窗口的回调方法。重点在于前后端约定好回调方法，类似 jsonp 方式。


# 其他参考

> [同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)
> [8种跨域方式](http://www.cnblogs.com/JChen666/p/3399951.html)
> [我知道的跨域安全](https://fed.renren.com/2018/01/20/cross-origin/)
> [浅谈 document.dommain](http://www.codeweblog.com/%E6%B5%85%E8%B0%88document-domain/)

  [1]: http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html
  [3]: https://github.com/Nealyang/YOU-SHOULD-KNOW-JS/blob/master/doc/basic_js/JavaScript中的跨域总结.md
  [4]: https://segmentfault.com/a/1190000012469713
