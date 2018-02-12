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