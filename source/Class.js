/*
	PseudoClass - JavaScript inheritance

	Construction:
		Setup and construction should happen in the construct() method.
		The construct() method is automatically chained, so all construct() methods defined by superclass methods will be called first.

	Initialization:
		Initialziation that needs to happen after all construct() methods have been called should be done in the init() method.
		The init() method is not automatically chained, so you must call this._super() if you intend to call the superclass' init method.
		init() is not passed any arguments

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
		construct() is used to setup instances and is chained so superclass construct() methods run automatically
		destruct() is used to tear down instances. destruct() is also chained
		init(), if defined, is called after construction is complete and is not chained
		toString() can be defined as a string or a function
		mixin() is provided to mix properties into an instance
		properties.mixins as an array results in each of the provided objects being mixed in (last object wins)
		this._super() is supported in mixins
		properties, if defined, should be a hash of property descriptors as accepted by Object.defineProperties
*/
(function(global) {
	// Extend the current context by the passed objects
	function extendThis() {
		var i, ni, objects, object, prop;
		objects = arguments;
		for (i = 0, ni = objects.length; i < ni; i++) {
			object = objects[i];
			for (prop in object) {
				this[prop] = object[prop];
			}
		}

		return this;
	}

	// Return a function that calls the specified method, passing arguments
	function makeApplier(method) {
		return function() {
			return this[method].apply(this, arguments);
		};
	}

	// Merge and define properties
	function defineAndInheritProperties(Component, properties) {
		var constructor,
			descriptor,
			property,
			propertyDescriptors,
			propertyDescriptorHash,
			propertyDescriptorQueue;

		// Set properties
		Component.properties = properties;

		// Traverse the chain of constructors and gather all property descriptors
		// Build a queue of property descriptors for combination
		propertyDescriptorHash = {};
		constructor = Component;
		do {
			if (constructor.properties) {
				for (property in constructor.properties) {
					propertyDescriptorQueue = propertyDescriptorHash[property] || (propertyDescriptorHash[property] = []);
					propertyDescriptorQueue.unshift(constructor.properties[property]);
				}
			}
			constructor = constructor.superConstructor;
		}
		while (constructor);

		// Combine property descriptors, allowing overriding of individual properties
		propertyDescriptors = {};
		for (property in propertyDescriptorHash) {
			descriptor = propertyDescriptors[property] = extendThis.apply({}, propertyDescriptorHash[property]);

			// Allow setters to be strings
			// An additional wrapping function is used to allow monkey-patching
			// apply is used to handle cases where the setter is called directly
			if (typeof descriptor.set === 'string') {
				descriptor.set = makeApplier(descriptor.set);
			}
			if (typeof descriptor.get === 'string') {
				descriptor.get = makeApplier(descriptor.get);
			}
		}

		// Store option descriptors on the constructor
		Component.properties = propertyDescriptors;
	}

	// Used for default initialization methods
	var noop = function() {};

	// Given a function, the superTest RE will match if _super is used in the function
	// The function will be serialized, then the serialized string will be searched for _super
	// If the environment isn't capable of function serialization, make it so superTest.test always returns true
	var superTest = /xyz/.test(function(){return 'xyz';}) ? /\._super\b/ : { test: function() { return true; } };

	// Bind an overriding method such that it gets the overridden method as its first argument
	var superifyDynamic = function(name, func, superPrototype) {
		return function PseudoClass_setStaticSuper() {
			// Store the old super
			var previousSuper = this._super;

			// Use the method from the superclass' prototype
			// This strategy allows monkey patching (modification of superclass prototypes)
			this._super = superPrototype[name];

			// Call the actual function
			var ret = func.apply(this, arguments);

			// Restore the previous value of super
			// This is required so that calls to methods that use _super within methods that use _super work
			this._super = previousSuper;

			return ret;
		};
	};

	var superifyStatic = function(name, func, object) {
		// Store a reference to the overridden function
		var _super = object[name];

		return function PseudoClass_setDynamicSuper() {
			// Use the method stored at declaration time
			this._super = _super;

			// Call the actual function
			return func.apply(this, arguments);
		};
	};

	// Mix the provided properties into the current context with the ability to call overridden methods with _super()
	var mixin = function(properties, superPrototype) {
		// Use this instance's prototype if no prototype provided
		superPrototype = superPrototype || this.constructor && this.constructor.prototype;
		
		// Copy the properties onto the new prototype
		for (var name in properties) {
			var value = properties[name];

			// Never mix construct or destruct
			if (name === 'construct' || name === 'destruct')
				continue;

			// Check if the property if a method that makes use of _super:
			// 1. The value should be a function
			// 2. The super prototype should have a function by the same name
			// 3. The function should use this._super somewhere
			var usesSuper = superPrototype && typeof value === 'function' && typeof superPrototype[name] === 'function' && superTest.test(value);

			if (usesSuper) {
				// Wrap the function such that this._super will be available
				if (this.hasOwnProperty(name)) {
					// Properties that exist directly on the object should be superified statically
					this[name] = superifyStatic(name, value, this);
				}
				else {
					// Properties that are part of the superPrototype should be superified dynamically
					this[name] = superifyDynamic(name, value, superPrototype);
				}
			}
			else {
				// Directly assign the property
				this[name] = value;
			}
		}
	};

	// The base Class implementation acts as extend alias, with the exception that it can take properties.extend as the Class to extend
	var PseudoClass = function(properties) {
		// If a class-like object is passed as properties.extend, just call extend on it
		if (properties && properties.extend)
			return properties.extend.extend(properties);

		// Otherwise, just create a new class with the passed properties
		return PseudoClass.extend(properties);
	};
	
	// Add the mixin method to all classes created with PseudoClass
	PseudoClass.prototype.mixin = mixin;
	
	// Creates a new PseudoClass that inherits from this class
	// Give the function a name so it can refer to itself without arguments.callee
	PseudoClass.extend = function extend(properties) {
		// The constructor handles creating an instance of the class, applying mixins, and calling construct() and init() methods
		function PseudoClass() {
			// Optimization: Requiring the new keyword and avoiding usage of Object.create() increases performance by 5x
			if (this instanceof PseudoClass === false) {
				throw new Error('Cannot create instance without new operator');
			}

			// Set properties
			var propertyDescriptors = PseudoClass.properties;
			if (propertyDescriptors) {
				Object.defineProperties(this, propertyDescriptors);
			}

			// Optimization: Avoiding conditionals in constructor increases performance of instantiation by 2x
			this.construct.apply(this, arguments);

			this.init();
		}

		var superConstructor = this;
		var superPrototype = this.prototype;

		// Store the superConstructor
		// It will be accessible on an instance as follows:
		//	instance.constructor.superConstructor
		PseudoClass.superConstructor = superConstructor;

		// Add extend() as a static method on the constructor
		PseudoClass.extend = extend;

		// Create an object with the prototype of the superclass
		// Store the extended class' prototype as the prototype of the constructor
		var prototype = PseudoClass.prototype = Object.create(superPrototype);

		// Assign prototype.constructor to the constructor itself
		// This allows instances to refer to this.constructor.prototype
		// This also allows creation of new instances using instance.constructor()
		prototype.constructor = PseudoClass;

		// Store the superPrototype
		// It will be accessible on an instance as follows:
		//	instance.superPrototype
		//	instance.constructor.prototype.superPrototype
		prototype.superPrototype = superPrototype;

		if (properties) {
			// Set property descriptors aside
			// We'll first inherit methods, then we'll apply these
			var propertyDescriptors = properties.properties;
			delete properties.properties;

			// Mix the new properties into the class prototype
			// This does not copy construct and destruct
			mixin.call(prototype, properties, superPrototype);

			// Mix in all the mixins
			// This also does not copy construct and destruct
			if (Array.isArray(properties.mixins)) {
				for (var i = 0, ni = properties.mixins.length; i < ni; i++) {
					// Mixins should be _super enabled, with the methods defined in the prototype as the superclass methods
					mixin.call(prototype, properties.mixins[i], prototype);
				}
			}

			// Define properties from this class and its parent classes
			defineAndInheritProperties(PseudoClass, propertyDescriptors);

			// Chain the construct() method (supermost executes first) if necessary
			if (properties.construct) {
				var construct = properties.construct;
				if (superPrototype.construct) {
					prototype.construct = function() {
						superPrototype.construct.apply(this, arguments);
						construct.apply(this, arguments);
					};
				}
				else {
					prototype.construct = construct;
				}
			}
			
			// Chain the destruct() method in reverse order (supermost executes last) if necessary
			if (properties.destruct) {
				var destruct = properties.destruct;
				if (superPrototype.destruct) {
					prototype.destruct = function() {
						destruct.apply(this, arguments);
						superPrototype.destruct.apply(this, arguments);
					};
				}
				else {
					prototype.destruct = destruct;
				}
			}

			// Allow definition of toString as a string (turn it into a function)
			if (typeof properties.toString === 'string') {
				var className = properties.toString;
				prototype.toString = function() { return className; };
			}
		}

		// Define construct and init as noops if undefined
		// This serves to avoid conditionals inside of the constructor
		if (typeof prototype.construct !== 'function')
			prototype.construct = noop;
		if (typeof prototype.init !== 'function')
			prototype.init = noop;

		return PseudoClass;
	};
	
	if (typeof module !== 'undefined' && module.exports) {
		// Node.js Support
		module.exports = PseudoClass;
	}
	else if (typeof global.define === 'function') {
		(function(define) {
			// AMD Support
			define(function() { return PseudoClass; });
		}(global.define));
	}
	else {
		// Browser support
		global.PseudoClass = PseudoClass;

		// Don't blow away existing Class variable
		if (!global.Class) {
			global.Class = PseudoClass;
		}
	}
}(this));
