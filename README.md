# reflection-js

[![Build Status](https://img.shields.io/travis/poliveira/reflection-js.png)](https://img.shields.io/travis/poliveira/reflection-js)
[![codecov.io](https://codecov.io/github/poliveira/reflection-js/coverage.svg?branch=master)](https://codecov.io/github/poliveira/reflection-js?branch=master)

Although there are no classes in JavaScript, therefore the term "reflection" wouldn't be very accurate, this is an attempt to bring some of the features from languages like C# and Java to JavaScript.

## Getting Started
Install the module with: `npm install --save require-js`

```javascript
var reflection = require("reflection-js");
```

## Documentation

#### `call(functionName, [args])`
Execute a function by name.

```javascript
var obj = {
  print: function () {
    console.log("it works!");
  },
  sum: function (a, b) {
    return a + b;
  }
};

reflection(obj).call("print"); // "it works!"
reflection(obj).call("sum", 5, 5); // 10
```

#### `clone()`
Creates an exact copy of the object without keeping a reference to it.

```javascript
var obj = {
  a: "a"
};

var copy = reflection(obj).clone();
copy.a = "b";

console.log(obj.a); // "a"
console.log(copy.a); // "b"
```

#### `get(propertyName)`
Returns a reference to a property. Also accepts a namespace as argument like `"my.cool.namespace"`.

```javascript
var obj = {
  name: "jose",
  company: {
    name: "Reflectors Inc"
  },
  print: function () {
    console.log(this.name);
  }
};

var ref;

ref = reflection(obj).get("name");
console.log(ref); // "jose"

ref = reflection(obj).get("company.name");
console.log(ref); // "Reflectors Inc"
```

You can also run methods like:

```javascript
ref = reflection(obj).get("print");
ref(); // "jose"
```

#### `methods()`
Returns an array with all methods names. In this case, properties are ignored.

```javascript
var obj = {
  name: "jose",
  print: function () {
    console.log(this.name);
  },
  sayHello: function () {
    console.log("hello!");
  }
};

var methods = reflection(obj).methods();
console.log(methods); // ["print", "sayHello"]
```

#### `owns(propertyName)`
Check if the object owns a property. Also accepts a namespace as argument like `"my.cool.namespace"`.

```javascript
var obj = {
  name: "jose",
  company: {
    name: "Reflectors Inc"
  }
};

reflection(obj).owns("name"); // true
reflection(obj).owns("company.name"); // true
reflection(obj).owns("age"); // false
```

#### `properties()`
Returns an array with all properties names. In this case, methods are ignored.

```javascript
var obj = {
  name: "jose",
  age: 32,
  sayHello: function () {
    console.log("hello!");
  }
};

var properties = reflection(obj).properties();
console.log(properties); // ["name", "age"]
```

#### `set(propertyName, value)`
Sets a property value. If the property does not exists, it will be created, even if it is a nested property.
Also accepts a namespace as argument like `"my.cool.namespace"`.

```javascript
var obj = {
  name: "jose",
  company: {
    name: null
  }
};

reflection(obj).set("name", "bob");
console.log(obj.name); // "bob"

reflection(obj).set("company.name", "Reflectors Inc");
console.log(obj.company.name); // "Reflectors Inc"

reflection(obj).set("company.website", "www.getreflectors.com");
console.log(obj.company.website); // "www.getreflectors.com"
```

#### `type()`
Returns a string containing the type of the current object.

```javascript
var obj = {};

var type;

type = reflection(obj).type();
console.log(type); // "Object"

type = reflection(null).type();
console.log(type); // "Null"

type = reflection(1).type();
console.log(type); // "Number"

type = reflection(/abc/).type();
console.log(type); // "RegExp"
```

## License

The MIT License (MIT)

Copyright (c) 2015 Pablo Oliveira

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
