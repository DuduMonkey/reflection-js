# reflection-js

[![Build Status](https://api.travis-ci.org/poliveira/reflection-js.png)](https://api.travis-ci.org/poliveira/reflection-js)

## Getting Started
Install the module with: `npm install require-js`

```javascript
var reflection = require("reflection-js");
```

## Documentation

#### call(functionName, [args])
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

#### get(propertyName)
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

#### methods()
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

#### owns(propertyName)
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

#### properties()
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

#### set(propertyName, value)
Sets a property value. If the property does not exists, it will be created, even if it is an nested property.
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
