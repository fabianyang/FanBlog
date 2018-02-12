---
title: 跨页面通信
categories:
- JavaScript
tags:
- CORS
date: 2017-02-02 15:04:51
---

## 前言

由于 flash 被各大浏览器枪毙，所以原先的 IM 架构需要调整，不能再使用 flash 做跨页面通信，需要找到新的解决方案。几番周折，把想到的可能实现方法做个总结。

## 轮询

### Cookie 轮询

优点：主域共享，可以跨子域访问。

缺点：cookie 存储空间有限，所有变换都需要存储，跟着请求发送，效率低，耗费高。

### [LocalStorage](https://caniuse.com/#search=localstorage) 轮询

优点：存储空间大，兼容性还算不错。

缺点：不能跨域，`storage` 事件兼容性不太好。两个页面把握不准通信时机，处理逻辑比较复杂。

比如，A页面此刻需要发送给B页面一条消息 `hello B` ，会设置 `localStorage.setItem('message','hello B')` ，并且轮询等待B的消息；而B此刻也同样轮询等待 `localStorage` 的 `message` 项的变化，当获取到 `message` 字段时，便取出消息 `hello B`。B如果要发消息给A，仍然采用同样套路。

### 长轮询

优点：兼容性好，低版本浏览器通用解决方案。

缺点：消耗服务器资源严重。

## LocalStorage 事件监听

通过监听 window 对象的 `storage` 事件，其他窗口获取到本窗口发送的消息。注意，必须是同一款浏览器，并且在同一个域名下。

```js
// 本窗口的设值代码
localStorage.setItem('test', JSON.stringify({
    username: 'bigbun',
    now: Date.now()
}));
// 请务必注意，localStorage不能直接传送复合类型的值(对象)

// 其他窗口监听storage事件
$(window).on('storage', function (ev) {
    var event = ev.originalEvent,
        message = JSON.parse(event.newValue);
    // 解析出复合的对象值
    // 对获取到的值进行处理
    console.log(message);
});
```

如果项目可以确定是同域跨页面数据共享需求，个人认为此种方式还是不错的。也有兼容性不错的兼容方案。

```js
var LocalStorage = (function (K) {
    var ls = window.localStorage;

    function _onstorage(key, callback) {
        var oldValue = ls[key];
        // IE下即使是当前页面触发的数据变更，当前页面也能收到onstorage事件，其他浏览器则只会在其他页面收到
        return function (e) {
            // IE下不使用setTimeout尽然获取不到改变后的值?!
            setTimeout(function () {
                e = e || window.storageEvent;

                var tKey = e.key,
                    newValue = e.newValue;
                // IE下不支持key属性,因此需要根据storage中的数据判断key中的数据是否变化
                if (!tKey) {
                    var nv = ls[key];
                    if (nv != oldValue) {
                        tKey = key;
                        newValue = nv;
                    }
                }
                if (tKey == key) {
                    callback && callback(newValue);
                    oldValue = newValue;
                }
            }, 0);
        }
    }
    return {
        getItem: function (key) {
            return ls.getItem(key);
        },
        setItem: function (key, val) {
            return ls.setItem(key, val);
        },
        removeItem: function (key, val) {
            return ls.removeItem(key);
        },
        clear: function () {
            return ls.clear();
        },
        onstorage: function (key, callback) {
            // IE6/IE7/Chrome使用Timer检查更新，其他使用onstorage事件
            /*
                Chrome下(14.0.794.0)重写了document.domain之后会导致onstorage不触发
                鉴于onstorage的兼容性问题暂时不使用onstorage事件，改用传统的轮询方式检查数据变化
            */
            var b = K.Browser;

            if (!this.useTimer) {
                // IE注册在document上
                if (document.attachEvent && !K.Browser.opera) {
                    document.attachEvent('onstorage', _onstorage(key, callback));
                }
                // 其他注册在window上
                else {
                    window.addEventListener('storage', _onstorage(key, callback), false);
                }
            } else {
                // Timer检查方式
                var listener = _onstorage(key, callback);
                setInterval(function () {
                    listener({});
                }, this.interval);
            }
        },
        // 是否使用Timer来check
        useTimer: (K.Browser.ie && K.Browser.ie < 8) || (K.Browser.chrome),
        // 检查storage是否发生变化的时间间隔
        interval: 1000
    };
})(window);
```

## 跨文档通信和通道通信

### 跨文档通信：[`postMessage`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage) 方法

如果两个交互的页面有依赖关系，比如：通过 `window.open` 或者 `iframe` 嵌入的页面，可以通过此 Api 完成通信。

1. `window.open`

缺点：只能与当前页面打开的页面完成通讯。当子窗口刷新后，父子窗口之间的引用关系会消失，此时子窗口也不能接收到父窗口的消息。

```js
// parent.html
const childPage = window.open('child.html', 'child');

childPage.onload = () => {
    childPage.postMessage('hello', location.origin);
};

// child.html
window.onmessage = (evt) => {
    // evt.data
    console.log(evt.data);
};
```

提示：

1. 当指定 `window.open` 的第二个name参数时，再次调用 `window.open('****', 'child')` 会使之前已经打开的同name子页面刷新
2. 由于安全策略，异步请求之后再调用 `window.open` 会被浏览器阻止，不过可以通过句柄设置子页面的 url 即可实现类似效果

```js
// 首先先开一个空白页
const tab = window.open('about:blank')

// 请求完成之后设置空白页的url
fetch( /* ajax */ ).then(() => {
    tab.location.href = '****'
});
```

2. `iframe`

```js
window.parent.frames[1].postMessage(message, '*');
```

```js
var messageHandle = function(e) {
    console.log(e.data);
};
if (window.addEventListener) {
    // 接受信息
    window.addEventListener("message", messageHandle, false);
} else if (window.attachEvent) {
    // 接受信息，兼顾IE8之流
    window.attachEvent('onmessage', messageHandle);
}
```

### `MessageChannel` `MessagePort` 通道通信

如果两个 `iframe` 之间需要通信，可以使用此 Api 完成。

实际上创造了两个相互关联的端口。一个端口保持开放，为发送端。另外一个被转发到其他浏览上下文。

```js
// 主页面
// 监听从右侧框架传来的信息
window.addEventListener('message', function(evt) {
    if (evt.origin == 'http://www.abc.com') {
        if ( evt.ports.length > 0 ) {
            // 将端口转移到其他文档
            window.frames[0].postMessage('端口打开','http://www.avc.com', evt.ports);
        }
    }
}, false);
```

```js
// iframe1
var port;
if (port === undefined) {
    alert('信息发送失败，目前没有可用端口！');
} else {
    port.postMessage(message);
}

window.addEventListener('DOMContentLoaded', function(e) {
    window.addEventListener('message', function(evt) {
        // 扩大端口范围
        if (evt.origin == 'http://www.abc.com') {
            port = evt.ports[0];
        } else {
            console.log(evt.origin +'非法');
        }
    }, false);
    window.parent.postMessage('发送页加载完毕', 'http://www.abc.com');
}, false);
```

```js
// iframe2
var messageHandle = function(e) {
    console.log(e.data);
};
window.addEventListener('DOMContentLoaded', function() {
    // 创建一个新的 MessageChannel 对象
    var mc = new MessageChannel();

    // 给父级发送一个端口
    window.parent.postMessage('显示页加载完毕','http://www.abc.com',[mc.port1]);

    // 显示发送的信息
    mc.port2.addEventListener('message', messageHandle, false);
    mc.port2.start();
}, false);
```

安全问题：

可以看到，每次接收到消息都需要判断来源 `evt.origin`，否则很容易导致跨站点脚本攻击。


## (`SharedWorker`)[https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker]

缺点：兼容性差，IE, Safari 不支持。调试不方便。

```js
// A.html
var sharedworker = new SharedWorker('worker.js')
sharedworker.port.start()
sharedworker.port.onmessage = evt => {
	// evt.data
}

// B.html
var sharedworker = new SharedWorker('worker.js')
sharedworker.port.start()
sharedworker.port.postMessage('hello')

// worker.js
const ports = []
onconnect = e => {
	const port = e.ports[0]
	ports.push(port)
	port.onmessage = evt => {
		ports.filter(v => v!== port) // 此处为了贴近其他方案的实现，剔除自己
		.forEach(p => p.postMessage(evt.data))
	}
}
```

## WebSocket

所有的 WebSocket 都监听同一个服务器地址，利用 send 发送消息，利用 onmessage 获取消息的变化，不仅能窗口，还能跨浏览器，兼容性最佳，只是需要消耗点服务器资源。
```js
var ws = new WebSocket("ws://www.example.com/socketserver");
ws.onopen = function (event) {
    // 或者把此方法注册到其他事件中，即可与其他服务器通信
    ws.send({
        username: 'yiifaa',
        now: Date.now()
    }); // 通过服务器中转消息
};
ws.onmessage = function (event) {
    // 消费消息
    console.log(event.data);
}
```

## 总结

如果不跨域情况，使用 LocalStorage 监听 `stroage` 事件是比较不错的选择。

但往往网站比较大的时候，子域名很多，就需要借助服务器端进行通信比较靠谱。


## 参考
> [跨页面通信的各种姿势](https://juejin.im/post/59bb7080518825396f4f5177)
>
> [HTML 5本地存储之兼容性与存储监听](http://developer.51cto.com/art/201204/331588.htm)
>
> [HTML5本地储存--利用storage事件实时监听Web Storage](http://blog.csdn.net/sinat_19327991/article/details/73331024)
>
> [localStorage、sessionStorage详解，以及storage事件使用](https://www.cnblogs.com/inconceivable/p/5960202.html)
>
> [Storage事件无法触发解决](http://blog.csdn.net/jlin991/article/details/55855524)
>
> [跨浏览器tab页的通信解决方案尝试](http://www.cnblogs.com/accordion/p/7535188.html)
>
> [HTML5 postMessage iframe跨域web通信简介](http://www.zhangxinxu.com/wordpress/2012/02/html5-web-messaging-cross-document-messaging-channel-messaging/)


[1]: [跨窗口通信的几种方法](http://web.jobbole.com/82225/)
[2]: [跨浏览器页面标签通信方案](http://blog.163.com/silver9886@126/blog/static/3597186220164684842476/)