---
title: 跨域资源共享
categories:
- JavaScript
tags:
- CORS
date: 2017-02-01 15:04:51
---

# CORS 跨域资源共享 （Cross-Origin Resource Sharing）

CORS 是一个 W3C 标准，允许浏览器向跨源服务器发出 `XMLHttpRequest` 请求，从而克服了AJAX只能同源使用的限制。

CORS 需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能，IE 浏览器不能低于 IE10 。

注意：因为和传统 Ajax 不同，现代浏览器 CORS 跨域，浏览器发出的是 XMLHttpRequest Level 2 请求。前端不是很关心发出的是什么样的请求，经常关注点在是否能够获取正确数据。所以，实现 CORS 通信的关键是服务器，需要服务器支持 CORS 接口。

JSONP 只支持 GET 请求， CORS 支持所有类型的 HTTP 请求。 JSONP 的优势在于支持老式浏览器，以及可以向不支持 CORS 的网站请求数据。

## 1. 简单请求（simple request）

必要条件：必须同时满足

1. 请求方法只能是 `HEAD`, `GET`, `POST` 之一。
2. HTTP 的头信息不超出以下字段：
- Accept
- Accept-Language
- Content-Language
- Last-Event-ID
- Content-Type

其中 `Content-Type` 只能是 `application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain` 三者之一。

### 1.1 浏览器 CORS 简单请求基本流程

对于简单请求，浏览器直接发出 CORS 请求，并增加一个 `Origin` 字段。

```
GET /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

浏览器发现这次跨域 AJAX 请求是简单请求，会自动在头信息之中，添加一个 `Origin` 字段。

`Origin` 字段说明请求来自哪个源（协议 + 域名 + 端口）。服务器根据这个字段，决定是否同意这次请求。

#### `Origin` 域名不在许可范围内

服务器会返回一个正常的 HTTP 响应。

**正常的 HTTTP 响应**：可以理解为直接在浏览器地址栏输入请求地址的 GET 请求，或同源下发出的 POST 请求，服务器所返回的响应头和数据。

但由于是 CORS 跨域请求，浏览器接到响应，发现响应的头信息没有包含 `Access-Control-Allow-Origin` 字段，会自动抛出一个错误，被 `XMLHttpRequest` 的 `onerror` 回调函数捕获。

注意：HTTP 响应的状态码有可能是 200 。并且也无法从 `onerror` 方法中继续执行代码，因为返回的数据不会出现在 `onerror` 参数中。

#### `Origin` 域名在许可范围内

服务器返回的响应，会多出几个头信息字段。

```
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: FooBar
Content-Type: text/html; charset=utf-8
```

有三个与 CORS 请求相关的字段，`Access-Control-Allow-Origin`, `Access-Control-Allow-Credentials`, `Access-Control-Expose-Headers`。

1. `Access-Control-Allow-Origin`

CORS 响应头必须值。并且值要么是请求时 `Origin` 字段的值，要么是一个 `*` 接受任意域名的请求。

2. `Access-Control-Allow-Credentials`

CORS 响应头可选值。布尔值，表示是否允许发送 Cookie 。默认情况下，Cookie 不包括在 CORS 请求之中。

值只能设为 `true` 即表示服务器明确许可， `Cookie` 可以包含在请求中，一起发给服务器。

如果服务器不要浏览器发送 `Cookie`，删除该字段即可。

3. `Access-Control-Expose-Headers`

CORS 响应头可选值。浏览器 CORS 请求，`XMLHttpRequest` 对象的 `getResponseHeader()` 方法只能拿到 6 个基本字段。

`Cache-Control`, `Content-Language`, `Content-Type`, `Expires`, `Last-Modified`, `Pragma`

如果想拿到其他字段，就必须在 `Access-Control-Expose-Headers` 里面指定。

比如：`Access-Control-Expose-Headers: FooBar` 指定，`xhr.getResponseHeader('FooBar')` 可以返回 `FooBar` 字段的值。

### 1.2 浏览器 CORS 请求 withCredentials 属性

浏览器 CORS 简单请求默认不发送 Cookie 和 HTTP 认证信息。

如果要把 `Cookie` 发到服务器，一方面要服务器同意，响应指定 `Access-Control-Allow-Credentials` 字段。另一方面，开发者必须在 AJAX 请求中打开`withCredentials` 属性。

```js
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

否则，即使服务器同意发送 `Cookie`，浏览器也不会发送。

但是，如果省略 `withCredentials` 设置，**有的浏览器还是会一起发送 `Cookie`**。这时，可以显式关闭 `withCredentials`。

## 2. 非简单请求（not-so-simple request）

### 2.1 预检请求（preflight）

非简单请求是那种对服务器有特殊要求的请求，比如请求方法是 `PUT` 或 `DELETE` ，或者 `Content-Type` 字段的类型是 `application/json` 。

Tips：要求实现 RESTful API 。

非简单请求的 CORS 请求，会在正式通信之前，浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些 HTTP 动词和头信息字段。**只有得到肯定答复，浏览器才会发出正式的 `XMLHttpRequest` 请求，否则就报错。**

举例：

```js
var url = 'http://api.alice.com/cors';
var xhr = new XMLHttpRequest();
// method 'PUT'
xhr.open('PUT', url, true);
// custom request header
xhr.setRequestHeader('X-Custom-Header', 'value');
xhr.send();
```

浏览器发现，这是一个非简单请求，就自动发出一个"预检"请求，要求服务器确认是否可以这样请求。

```
OPTIONS /cors HTTP/1.1
Origin: http://api.bob.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

"预检"请求的 HTTP 头信息包含:

- 请求方法 `OPTIONS` ，表示这个请求是用来询问的。
- 关键字段 `Origin` ，表示请求来自哪个源。

以及两个特殊字段：

1. `Access-Control-Request-Method`

preflight 请求头必须值。 列出浏览器的 CORS 请求会用到的 HTTP Method ，比如：`PUT` 。

2. `Access-Control-Request-Headers`

preflight 请求头可选值。如果浏览器 CORS 非简单请求包含自定义 Header 请求头，preflight 请求头将显示该字段。是一个逗号分隔的字符串，指定会额外发送的头信息字段，比如：`X-Custom-Header` 。

### 2.2 预检请求的回应（preflight response）

服务器收到"预检"请求以后，检查 `Origin`, `Access-Control-Request-Method`, `Access-Control-Request-Headers` 字段

#### 确认允许跨源请求

做出回应，返回以下头信息。

```
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2.0.61 (Unix)
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain
```

关键的是 `Access-Control-Allow-Origin` 字段，表示 `http://api.bob.com` 域名可以请求数据。该字段也可以设为星号，表示同意任意跨源请求。

#### 否定"预检"请求

返回一个正常的 HTTP 回应，但是没有 `Access-Control-Allow-Origin` 头信息字段。

浏览器认定，服务器不同意预检请求，会触发一个错误，被 `XMLHttpRequest` 对象的 `onerror` 回调函数捕获。

```
XMLHttpRequest cannot load http://api.alice.com.
Origin http://api.bob.com is not allowed by Access-Control-Allow-Origin.
```

服务器回应其他的 CORS 相关字段。

```
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 1728000
```

1. `Access-Control-Allow-Methods`

CORS 非简单请求必须值。值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。

注意：返回的是所有支持的方法，而不仅仅是浏览器"预检"请求的 Method 。为了避免多次"预检"请求。

2. `Access-Control-Allow-Headers`

如果 preflight 请求包括 `Access-Control-Request-Headers` 字段，则 `Access-Control-Allow-Headers` 字段是必须值，也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的自定义 Header 。

3. `Access-Control-Allow-Credentials`

与简单请求时的含义相同。

4. `Access-Control-Max-Age`

CORS 非简单请求可选值。指定本次预检请求的有效期，单位为秒。比如：有效期是20天（1728000秒），即允许缓存该条回应1728000秒（即20天）。在此期间，不用发出另一条预检请求。

### 2.3 浏览器的非简单请求正常请求回应

一旦服务器通过了"预检"请求，有效期内，以后每次浏览器正常的 CORS 请求，就都跟简单请求一样，会有一个 `Origin` 头信息字段。

服务器的回应，也都会有一个 `Access-Control-Allow-Origin` 头信息字段。

"预检"请求通过之后：

浏览器的正常 CORS 请求，自动添加 `Origin` 字段。

```
PUT /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
X-Custom-Header: value
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

服务器正常的回应，每次回应都必定包含 `Access-Control-Allow-Origin` 字段。

## 跨域错误现象

注意：只有 Ajax 请求才有跨域错误现象，正常 HTTP 请求是不存在跨域的。

### Error 1
```
No 'Access-Control-Allow-Origin' header is present on the requested resource
The response had HTTP status code 404
```

![img](http://olq0r66c9.bkt.clouddn.com/md/1516244846277.png)

错误原因：非简单请求，预检请求失败。服务器端没有提供 `OPTIONS` Method 请求的返回，导致 404。

### Error 2
```
No 'Access-Control-Allow-Origin' header is present on the requested resource
The response had HTTP status code 405
```

![img](http://olq0r66c9.bkt.clouddn.com/md/1516245620007.png)

错误原因：服务器端允许 `OPTIONS` Method 请求，但(安全)配置文件阻止返回，比如：文件读写权限问题。

### Error3
```
No 'Access-Control-Allow-Origin' header is present on the requested resource
status 200
```

![img](http://olq0r66c9.bkt.clouddn.com/md/1516245634479.png)

错误原因：预检请求依然失败。服务器端检查请求头信息，没有通过。比如： `Origin` 请求源不在白名单内，自定义请求头校验失败。

### Error4

```
heade contains multiple values '*,*'
```

![img](http://olq0r66c9.bkt.clouddn.com/md/1516245681091.png)
![img](http://olq0r66c9.bkt.clouddn.com/md/1516245694586.png)

错误原因：服务器配置文件配置了 `Access-Control-Allow-Origin`，请求方法内部又添加了一次 `Access-Control-Allow-Origin` 。

## OPTIONS 预检优化

后端或服务器配置 `Access-Control-Max-Age` 可以缓存此次请求的秒数。

在时间内，只进行一次预检请求，验证通过就不需要再次预检。

## 分析 AJAX

1. 正常 CORS

![img](http://olq0r66c9.bkt.clouddn.com/md/1516249323885.png)

2. 错误 CORS

跨域错误现象已经分析过，基本都是类似的，就是没有满足 `Access-Control-Allow-Origin` `Access-Control-Allow-Headers` `Access-Control-Allow-Methods` `Access-Control-Allow-Credentials`

3. 与 CORS 无关

![img](http://olq0r66c9.bkt.clouddn.com/md/1516249663412.png)

图中的请求，跨域配置没有问题，出错原因是 `request` 的 `Accept` 和 `response` 的 `Content-Type` 不匹配。

## 总结

![img](http://olq0r66c9.bkt.clouddn.com/md/1516244587921.png)

用心读完阮老师的文章 [CORS][1] 感觉受益匪浅，之前只是了解添加 `Access-Control-Allow-Origin` 头让服务器返回就可以跨域，但有时候需要指定域名有时候用 `*` 就可以，还有如何 AJAX 请求带上 Cookie 。这些都是知道怎么用但不知道原理。总结一点，这是 W3C 标准，是规定！浏览器按照这个标准实现的，服务器也要遵循这个规则，开发者更要理解可以这样操作原因是什么。遇到问题时应该多分析，发送的 `XMLHttpRequest` 发送了哪些数据，服务器又 `Response` 了哪些数据，问题出在了哪端。

> 服务器后端 CORS 配置 [参考][2]

[1]: http://www.ruanyifeng.com/blog/2016/04/cors.html
[2]: https://segmentfault.com/a/1190000012469713#articleHeader8