# PseudoClass [![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis] [![Code coverage status][coveralls-image]][coveralls] 
> An OOP framework for Node.js and the browser

#### Sweet syntactic sugar for prototypal inheritance.
PseudoClass provides `construct()`, `destruct()`, `_super()`, and an `init()` method that runs after construction is complete.

#### All the same under the hood.
PseudoClass uses JavaScript constructors and prototypal inheritance under the hood. Monkey-patching, `instanceof`, and `instance.constructor` all work as expected.

#### Not afraid to mix it up.
Mixins can be added when a class is declared using the `mixins` option or after instantiation with the `instance.mixin()` method.

#### Crushes boilerplate with a classy touch.
Stay classy and boilerplate-free with string-based `toString` declarations and automatic chaining of `construct()` and `destruct()`.

#### Define and override properties effortlessly.
Make instance properties non-writable, non-enumerable, or employ setters & getters with the `properties` option, then inherit and override individually.


## Dependencies

PseudoClass is completely standalone. All you need to stay classy is [`Class.js`][Class.min.js].


## Compatibility

As PseudoClass makes use of ECMAScript 5 features, it is only compatible with modern browsers.

* IE 9+
* Firefox 4+
* Chrome 6+
* Safari 5+
* Opera 12+
* Node 0.8+

PseudoClass can be used in a Node, AMD, or browser environment out of the box.

## Usage

PseudoClass empowers you without getting in your way. See the examples below to see how PseudoClass makes prototypal inheritance painless.


### Define a class

```javascript
var Parent = Class({
  toString: 'Parent',
  properties: {
    visible: {
      value: true,
      enumerable: true
    }
  },
  construct: function() {
    console.log('Parent: Constructing');
  },
  destruct: function() {
    console.log('Parent: Destructing');
  },
  doStuff: function() {
    console.log('Parent: Doing stuff');
  }
});
```


### Define a mixin

A mixin is a set methods you can plug into any class. Mixins can use `_super`, just like normal methods.

```javascript
var stuffDoer = {
  doStuff: function() {
    this._super();
    console.log('Mixin: Doing stuff');
  }
};
```


### Inherit from Parent and add a mixin to the class prototype

Mixins added at declaration time become part of the prototype.

```javascript
var Child = Parent.extend({
  toString: 'Child',
  mixins: [stuffDoer],
  properties: {
    visible: {
      value: false // Only override the value
    }
  },
  construct: function() {
    console.log(this+': Constructing');
  },
  destruct: function() {
    console.log(this+': Destructing');
  },
  doStuff: function() {
    this._super();
    console.log(this+': Doing stuff');
  }
});
```


### Create an instance

```
var child = new Child();
/* Output:
  Parent: Constructing
  Child: Constructing
*/
```


### Call a method

```javascript
child.doStuff();
/* Output:
  Parent: Doing stuff
  Child: Doing stuff
  Mixin: Doing stuff
*/
```


### Add a mixin to the instance

Mixins added after instantiation become part of the instance.

```javascript
child.mixin({
  doMoreStuff: function() {
    console.log(this+': Doing more stuff')
  }
});

child.doMoreStuff();
/* Output:
  Child: Doing more stuff
*/
```


### Check yo' self

```javascript
console.log(child.instanceOf(Child)); // true
console.log(child.instanceOf(Parent)); // true
console.log(child.constructor === Child) // true
console.log(child+''); // 'Child'
```


### Wreck yo' self

```javascript
child.destruct();
/* Output:
  Child: Destructing
  Parent: Destructing
*/
```

### No-conflict by default

PseudoClass is always accessible as `PseudoClass`. If you're using another library that defines `Class`, you can still use PseudoClass by referencing `PseudoClass` instead.


## License

PseudoClass is licensed under the permissive BSD license.


[Class.min.js]: http://lazd.github.io/PseudoClass/build/Class.min.js

[coveralls]: https://coveralls.io/r/lazd/PseudoClass?branch=master
[coveralls-image]: https://img.shields.io/coveralls/lazd/PseudoClass.svg

[travis]: http://travis-ci.org/lazd/PseudoClass
[travis-image]: https://secure.travis-ci.org/lazd/PseudoClass.svg?branch=master

[npm-url]: https://npmjs.org/package/pseudoclass
[npm-image]: https://badge.fury.io/js/pseudoclass.svg
