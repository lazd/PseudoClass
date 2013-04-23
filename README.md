# Class  [![Build status][travis-image]][travis] [![Code coverage status][coveralls-image]][coveralls]
> A JavaScript inheritance framework for Node.js and the browser

Class is a robust, lightweight a wrapper that gives you some sweet syntactic sugar for native prototypal JavaScript inheritance.


## Dependencies

Class is completely standalone with no dependencies. All you need to stay classy is `Class.js`.


## Compatibility

Class is compatible with the latest modern browsers and the oldest versions of Node.js and even IE 5 (with the use of `Class.polyfills.js`).


## Usage

Class empowers you without getting in your way. See the examples below to see how Class makes prototypal inheritance painless.


### Define a class

```javascript
var Parent = Class({
	toString: 'Parent',
	construct: function() {
		console.log('Parent: Constructing');
	},
	destruct: function() {
		console.log('Parent: Destructing');
	}
});
```


### Define a mixin

```javascript
var stuffDoer = {
	doStuff: function() {
		console.log('Mixin: Doing stuff');
		this._super();
	}
};
```


### Inherit from Parent and mix in a mixins

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
	doStuff: function() {
		console.log(this+': Doing stuff');
	}
});
```


### Create an instance

```
var child = new Child(); // The new keyword is optional
/* Output:
	Parent: Constructing
	Child: Constructing
*/
```


### Call a method

```javascript
child.doStuff();
/* Output:
	Mixin: Doing stuff
	Child: Doing stuff
*/
```


### Mixin some more

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

## License

Class is licensed under the permissive BSD license.


[coveralls]: https://coveralls.io/r/lazd/Class
[coveralls-image]: https://coveralls.io/repos/lazd/Class/badge.png?branch=master

[travis]: http://travis-ci.org/lazd/Class
[travis-image]: https://secure.travis-ci.org/lazd/Class.png?branch=master