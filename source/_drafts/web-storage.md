HTML5 localStorage and sessionStorage
HTML5 提供两种web存储方法，localStorage 与 sessionStorage



localStorage 与 sessionStorage 区别

localStorage没有过期时间，只要不clear或remove，数据会一直保存。

sessionStorage 针对一个session进行数据存储，生命周期与session相同，当用户关闭浏览器后，数据将被删除。



特点：

1.localStorage 默认支持的容量为一个站5M，当调用setItem超过上限时，会触发QuotaExceededError异常。当然有些浏览器支持修改容量上限，但为了兼容其他浏览器，最好按5M的容量来使用。


2.localStorage 是以key-value形式保存数据的，key和value只能是字符串格式。因此数字1保存后，会转换成字符串1。


3.localStorage 的写入与读取写法有以下几种：

复制代码
localStorage.name = 'fdipzone';
name = localStorage.name;

localStorage['name'] = 'fdipzone';
name = localStorage['name'];

localStorage.setItem('name', 'fdipzone');
name = localStorage.getItem('name');
复制代码
localStorage[key] = value写法主流浏览器都支持，官方并没有说明那一种写法是标准。但如果执行以下的代码就使localStorage失效。



localStorage.setItem = null;
localStorage.getItem = null;
localStorage.removeItem = null;
localStorage.clear = null;


因此，建议使用setItem(), getItem(), removeItem(), clear()来实现写入，读取，删除，清空。

4.如果要保存非字符串的内容，建议使用JSON来处理。写入数据时用JSON.stringify转成字符串，读取数据时用JSON.parse把字符串转为之前的格式。


http://www.css88.com/archives/4210

DOM Storage全解析

http://cache.baiducontent.com/c?m=9d78d513d9951cf04fede53f4b4b97354c0397624cc0a11f68a7e35f92144c31317194bb30536713a7c1682041f14606acb6746536703daade8dcd5dddcccb6f6cd37b23706bd71c4dce5cf89b04769477c60da8f44cbba7f03090add0d9dd524ec152077c81e78b2d5a529531&p=8a6d8f16d9c110f108e291755540&newp=9033c64ad4995bee08e291754e4792695803ed6039d4d401298ffe0cc4241a1a1a3aecbf20211b01d8c07a650bad4a5be8f732783c0634f1f689df08d2ecce7e759266&user=baidu&fm=sc&query=DOM+Storage%C8%AB%BD%E2%CE%F6&qid=a1dedb91000055cf&p1=1