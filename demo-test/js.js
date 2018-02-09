function unique(array) {
    var result = [];
    array.forEach(function (v) {
        if (!result.includes(v)) {
            result.push(v);
        }
    });
    return result;
}

'use strict';


var obj = document.getElementById('element');
obj.onclick = function () {
    console.log('js对象与dom对象循环引用导致了内存泄漏');
};

function fn() {
    var jsObj = document.getElementById('box');
    jsObj.oncontextmenu = function () {
        return false;
    };
}

var name = "bush";
var obj = {
    name: "obama",
    func: function () {
        return function () {
            return this.name
        }
    }
}
alert(obj.func()());


var name = "bush";
var obj = {
    name: "obama",
    func: function () {
        var This = this;
        return function () {
            return This.name
        }
    }
}
alert(obj.func()());

var name = "bush";

var obj = {
    name: "obama",
    func: function () {
        return function () {
            return this.name
        }
    }
}

alert(obj.func().call(obj));