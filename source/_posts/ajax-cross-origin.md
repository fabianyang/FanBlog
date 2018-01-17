

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

同样，如果只有二级或三级域名不同，设置 `document.domain` 相同，可以拿到 DOM。

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

2. JSONP 不受同源政策限制

基本思想：网页通过添加一个 `<script>` 元素，向服务器请求 JSON 数据，服务器收到请求后，将数据放在一个指定名字的回调函数里传回来。

注意：请求查询字符串必须有一个 `callback` 参数指定回调函数名称。数据将放在回调函数的参数位置返回并立即执行。

原理：生成 `<script>` 插入 `<body>` 指定 src 地址，没有设置请求头的余地，并且 `<script>` 的 `src` 属性是没有跨域限制，等同于在 `<script>` 中执行脚本。

3. WebSocket 通信协议不实行同源政策

原理：请求头 `Origin` 字段，表示该请求的请求源（origin），服务器可以根据这个字段，判断是否许可本次通信。所以 WebSocket 没有实行同源政策。

4. CORS 是跨源资源分享（Cross-Origin Resource Sharing）

它是 W3C 标准，是跨源 AJAX 请求的根本解决方法。允许任何类型的请求。




1. document.domain + iframe


2. post 302 back iframe




>

  [1]: http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html
  [3]: https://github.com/Nealyang/YOU-SHOULD-KNOW-JS/blob/master/doc/basic_js/JavaScript中的跨域总结.md
  [4]: https://segmentfault.com/a/1190000012469713
  [5]: https://zhidao.baidu.com/question/436475049126774884.html