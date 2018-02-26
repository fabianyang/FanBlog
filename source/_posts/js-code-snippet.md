---
title: JavaScript 代码片段
categories:
- JavaScript
tags:
- code
date: 2018-02-13 15:04:51
---
# 代码片段

## 前言

有些好用的代码，简洁高效，在此进行总结

### 随机数

Math.random() 返回大于等于 0 并且小于 1 之间的一个随机数。

#### 范围内的随机数

Math.random（）生成一个随机值，使用乘法将其映射到所需的范围

```js
const randomInRange = (min, max) => Math.random() * (max - min) + min;

// randomInRange(2,10) -> 6.0211363285087005
```

#### 范围内随机整数

Math.random（）生成一个随机数并将其映射到所需的范围，使用Math.floor（）使其成为一个整数

```js
const randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// randomIntegerInRange(0, 5) -> 2
```

### 数组

#### 随机化数组的顺序

sort（）重新排序元素，Math.random（）来随机排序。

```js
const shuffle = arr => arr.sort(() => Math.random() - 0.5);

// shuffle([1,2,3]) -> [2,3,1]
```

Array.map（）和 Math.random（）创建一个随机值的数组。 Array.sort（）根据随机值对原始数组的元素进行排序。

```js
count shuffle = arr => {
  let r = arr.map(Math.random);
  return arr.sort((a, b) => r[a] - r[b]);
}

// shuffle([1, 2, 3]) -> [2, 1, 3]
```

#### 数组去重

##### ES6 `Set` 和 `…` `rest` 操作符去掉所有重复值。

```js
const unique = arr => [...new Set(arr)];

// unique([1,2,2,3,4,4,5]) -> [1,2,3,4,5]
```

也可使用 [`Array.from(arrayLike, mapFn, thisArg)`][2]

```js
const unique = (array) => {
  return Array.from(new Set(array));
}
```


##### ES6 [`Array.prototype.includes(searchElement[, fromIndex = 0])`][3]

[`Array.prototype.indexOf(searchElement[, fromIndex = 0])`][1]

不足：无法判断 `undefined` 或 `NaN` 等特殊值。

```js
function unique(array) {
    var result = [];
    array.forEach(function (v) {
        if (!result.includes(v)) {
            result.push(v);
        }
    });
    return result;
}
```

##### ES5 利用递归思想，排序，数组后一项和前一项比较
```js
function unique(array) {
    var as = array.sort((a, b) => a - b);
    var result = [as[0]];
    as.reduce((a, b) => {
        if (a !== b) {
            result.push(b);
        }
        return b;
    });
    return result;
}
var a = [1, 2, 3, 4, 5, 6, 5, 3, 2, 4, 56, 4, 1, 2, 1, 1, 1, 1, 1, 1];
unique(a); // 1,2,3,4,5,6,56
```

```js
function unique(array) {
    var as = array.sort();
    return as.filter(function (v, i, context) {
        return v !== context[i + 1];
    });
}
```

##### 利用对象的属性不能相同的特点

```js
function distinct(array) {
    var i,
        obj = {},
        result = [];
    for (i = 0; i < array.length; i++) {
        if (!obj[array[i]]) {
            // 如果能查找到，证明数组元素重复了
            obj[array[i]] = 1;
            result.push(array[i]);
        }
    }
    return result;
}
var a = [1, 2, 3, 4, 5, 6, 5, 3, 2, 4, 56, 4, 1, 2, 1, 1, 1, 1, 1, 1];
distinct(a); // 1,2,3,4,5,6,56
```

不推荐：利用 Array.splice() 方法，改变原数组同时需要改变循环次数，效率低

#### 二维数组变一维数组

`Array.concat(array1, array2, ... ,arrayN)` 连接两个或多个数组。

```js
let list = [['11', '12', '13'], ['21', '22', '23'], ['31', '32', '33']];
Array.concat.apply([], list)
```

```js
var a = [1,2,3,[5,6],[1,4,8]];
var ta = a.join(",").split(",");
```

#### 从数组中获取最大值、最小值

Math.max（）与 运算符 `…` 结合得到数组中的最大值。

```js
const arrayMax = array => Math.max(...array);

// arrayMax([10, 1, 5]) -> 10
```

```js
var a = [1,2,3,5];
Math.min.apply(null, a); // 1
```

#### 计算数组交集和差集

```js
// by Evan You
let intersection = a.filter(v => b.includes(v))
let difference = a.concat(b).filter(v => !a.includes(v) || !b.includes(v))
```
```js
let a = new Set([1, 2, 3]);
let b = new Set([3, 5, 2]);

// 并集
let unionSet = new Set([...a, ...b]);
//[1,2,3,5]

// 交集
let intersectionSet = new Set([...a].filter(x => b.has(x)));
// [2,3]

// ab差集
let differenceABSet = new Set([...a].filter(x => !b.has(x)));
```


### 参数

#### 判断是否包含某个参数名

`Array.includes(searchElement, fromIndex)` 有意设计为通用方法。不要求this值是数组对象，所以它可以被用于其他类型的对象 (比如类数组对象)。

```js
(function() {
  console.log([].includes.call(arguments, 'a')); // true
  console.log([].includes.call(arguments, 'd')); // false
})('a','b','c');
```


## 推荐

([译]非常有用的 48 个 JavaScript 代码片段，值得收藏！)[https://juejin.im/entry/5a791567f265da4e8e7842a2?utm_source=gold_browser_extension]

(indexOf和includes的区别)[http://blog.csdn.net/wu_xianqiang/article/details/78681609?utm_source=debugrun&utm_medium=referral]

[1]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
[2]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from
[3]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes