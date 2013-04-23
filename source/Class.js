/*
	Class - JavaScript inheritance

	Construction:
		Setup and construction should happen in the construct() method.
		The construct() method is automatically chained, so all construct() methods defined by superclass methods will be called first.

	Initialization:
		Initialziation that needs to happen after all construct() methods have been called should be done in the init() method.
		The init() method is not automatically chained, so you must call this._super() if you intend to call the superclass' init method.
		init() is pass the same arguments that were passed to the construct() method.

	Destruction:
		Teardown and destruction should happen in the destruct() method. The destruct() method is also chained.

	Mixins:
		An array of mixins can be provided with the mixins[] property. An object or the prototype of a class should be provided, not a constructor.
		Mixins can be added at any time by calling this.mixin(properties)

	Usage:
		var MyClass = Class(properties);
		var MyClass = new Class(properties);
		var MyClass = Class.extend(properties);

	Credits:
		Inspired by Simple JavaScript Inheritance by John Resig http://ejohn.org/

	Usage differences:
		construct() is used to setup instances and is automatically chained so superclass construct() methods run automatically
		destruct() is used  to tear down instances. destruct() is also chained
		init(), if defined, is called after construction is complete and is not chained
		toString() can be defined as a string or a function
		mixin() is provided to mix properties into an instance
		properties.mixins as an array results in each of the provided objects being mixed in (last object wins)
		The new keyword is not required to create instances of classes
		construct() and init() are guarenteed to have an empty object as the first argument if no first argument is provided
		
	Implementation differences:
		Does not use initializing variable to avoid running construct(), instead uses Object.create
		Uses a function, not a regular expression if the environment does not support object serialization
		More than twice as many lines of code, but only 677 bytes minified and gzipped (1,512 bytes uncompressed)
		Dummy test for usage of super is faster in environments that don't support serialization
*/
(function() {
	// Given a function, the superTest RE will match if the _super method is referenced in any form
	// The function will be serialized, then the serialized string will be searched for _super
	//   Note: This can result in false positives, as comment containing _super will result in a match
	// If the environment isn't capable of function serialization, make it so superTest.test always returns true
	var superTest = /xyz/.test(function(){return 'xyz';}) ? /\b_super\b/ : { test: function() { return true; } };

	// Return a function that is capable of calling superclass methods
	var superfy = function(name, func, superPrototype, asIs) {
		// Store a reference to the function as is
		var superFunc = superPrototype[name];
		
		return function _super() {
			var oldSuper = this._super;
			
			// Temporarily assign _super to the method of the superclass by the same name as the called function
			// Or, if asIs was specified, use the method as it was during declaration
			this._super = asIs ? superFunc : superPrototype[name];
			
			// Call the function inside of a try block in case it throws
			try {
				return func.apply(this, arguments);
			}
			// Don't catch, but do ensure that _super is properly reassinged inside of the finally block
			finally {
				this._super = oldSuper;
			}
		};
	};
	
	// Mix the provided properties into the current context with the ability to call overridden methods with this._super()
	var mixin = function(properties, _super, asIs) {
		// Use our prototype if no super provided
		_super = _super || this.constructor && this.constructor.prototype;
		
		// Copy the properties onto the new prototype
		for (var name in properties) {
			if (!properties.hasOwnProperty(name)) continue;
			
			// Never mix construct or destruct
			if (name === 'construct' || name === 'destruct')
				continue;
			
			// Check if this property is a function that makes use of this._super() to call the overridden superclass method
			var usesSuper = _super && typeof properties[name] === "function" && typeof _super[name] === "function" && superTest.test(properties[name]);
			
			// Assign the function directly if we're not overriding
			// Otherwise, create a function that assigns this._super during the executing of the overriding function
			this[name] = usesSuper ? superfy(name, properties[name], _super, asIs) : properties[name];
		}
	};

	// The base Class implementation acts as extend alias, with the exception that it can take properties.extend as the Class to extend
	this.Class = function(properties) {
		// Support referencing the class to extend with properties.extend
		// With the assumption that the passed class has an extend method, just call extend on the passed class
		if (properties && properties.extend)
			return properties.extend.extend(properties);
		return Class.extend(properties);
	};
	
	// Add the mixin method to all classes created with Class
	this.Class.prototype.mixin = mixin;
	
	// Creates a new Class that inherits from this class
	// Give the function a name so it can refer to itself without arguments.callee
	Class.extend = function extend(properties) {
		var superPrototype = this.prototype;
		
		// Create an object with the prototype of the superclass
		var prototype = Object.create(superPrototype);
		
		if (properties) {
			// Mix the new properties into the class prototype
			mixin.call(prototype, properties, superPrototype);
			
			// Mix in all the mixins
			if (Array.isArray(properties.mixins)) {
				for (var i = 0, ni = properties.mixins.length; i < ni; i++) {
					// Mixins should be _super enabled, with the methods defined in the prototype as the superclass methods
					mixin.call(prototype, properties.mixins[i], prototype, true);
				}
			}
			
			// Chain the construct() method (supermost executes first)
			if (properties.construct && superPrototype.construct) {
				prototype.construct = function() {
					superPrototype.construct.apply(this, arguments);
					properties.construct.apply(this, arguments);
				};
			}
			else if (properties.construct)
				prototype.construct = properties.construct;
			
			// Chain the destruct() method in reverse order (supermost executes last)
			if (properties.destruct && superPrototype.destruct) {
				prototype.destruct = function() {
					properties.destruct.apply(this, arguments);
					superPrototype.destruct.apply(this, arguments);
				};
			}
			else if (properties.destruct)
				prototype.destruct = properties.destruct;
			
			// Allow definition of toString as a string (turn it into a function)
			if (typeof properties.toString === 'string') {
				var className = properties.toString;
				prototype.toString = function() { return className; };
			}
		}

		// The constructor handles creating an instance of the class, applying mixins, and calling construct() and init() methods
		function Class() {
			// Make sure the first argument is an object
			var args = Array.prototype.slice.call(arguments);
			if (args[0] === undefined) args[0] = {};
			
			// Instantiate the extended class
			var instance = Object.create(prototype);
			
			// Call our construct() methods, triggering chained calls to all superclass construct() methods
			if (instance.construct)
				instance.construct.apply(instance, args);
				
			// Call the init() method
			if (instance.init)
				instance.init.apply(instance, args);
				
			return instance;
		}
		
		// Store the extended class'prototype as the prototype of the constructor
		Class.prototype = prototype;
		
		// Assign prototype.constructor to the constructor itself
		// This allows instances to refer to this.constructor.prototype
		// This also allows creation of new instances using instance.constructor()
		Class.prototype.constructor = Class;
		
		// Add extend() as a static method on the constructor
		Class.extend = extend;
		
		return Class;
	};
	
	// Node.js compatibility
	if (typeof module !== 'undefined')
		module.exports = Class;
}());
