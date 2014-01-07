# PseudoClass  [![Build status][travis-image]][travis] [![Code coverage status][coveralls-image]][coveralls]
> An OOP framework for Node.js and the browser

#### Sweet syntactic sugar for prototypal inheritance.
PseudoClass provides `construct()`, `destruct()`, `_super()`, and an `init()` method that runs after construction is complete.

#### All the same under the hood.
PseudoClass uses JavaScript constructors and prototypal inheritance under the hood. Monkey-patching, `instanceof`, and `instance.constructor` all work as expected.

#### Not afraid to mix it up.
Mixins can be added when a class is declared or after instantiation with the `mixin()` method.

#### Crushes boilerplate with a classy touch.
Stay classy and boilerplate-free with string-based `toString` declarations and automatic chaining of `construct()` and `destruct()`.


## Dependencies

PseudoClass is completely standalone with no dependencies. All you need to stay classy is [`Class.js`][Class.min.js].


## Compatibility

PseudoClass is compatible with the latest modern browsers and the oldest versions of Node.js and even IE 5 (with the use of [`Class.polyfills.js`][Class.polyfills.min.js]).


## Usage

PseudoClass empowers you without getting in your way. See the examples below to see how PseudoClass makes prototypal inheritance painless.


### Define a class

```javascript
var Parent = Class({
	toString: 'Parent',
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
	doStuff: function(_super) {
		_super.call(this);
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
	construct: function() {
		console.log(this+': Constructing');
	},
	destruct: function() {
		console.log(this+': Destructing');
	},
	doStuff: function(_super) {
		_super.call(this);
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


## A word about minification

PseudoClass analyzes a method's string representation to determine if the `_super` argument is used. **If your minfier mangles variable names, you need to configure it to ignore `_super` for your entire project**, otherwise PseudoClass will be unable to tell if your function uses an overridden method.

Here's how to avoid mangling `_super` when using UglifyJS:

#### grunt-contrib-uglify configuration in Gruntfile.js
```javascript
uglify: {
	options: {
		mangle: {
			except: ['_super']
		}
	},
	// ...
}
```

#### UglifyJS2 shell command
```shell
uglifyjs ... -m -r '_super'
```

#### UglifyJS (deprecated) shell command
```shell
uglifyjs --reserved-names '_super' ... 
```


## License

PseudoClass is licensed under the permissive BSD license.


[Class.min.js]: http://lazd.github.io/PseudoClass/build/Class.min.js
[Class.polyfills.min.js]: http://lazd.github.io/PseudoClass/build/Class.polyfills.min.js

[coveralls]: https://coveralls.io/r/lazd/PseudoClass
[coveralls-image]: https://coveralls.io/repos/lazd/PseudoClass/badge.png?branch=master

[travis]: http://travis-ci.org/lazd/PseudoClass
[travis-image]: https://secure.travis-ci.org/lazd/PseudoClass.png?branch=master
