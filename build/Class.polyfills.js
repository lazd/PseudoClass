if (!Object.create) {
	/**
		Polyfill for Object.create. Creates a new object with the specified prototype.
		
		@author <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create/">Mozilla MDN</a>
		
		@param {Object} prototype	The prototype to create a new object with
	*/
	Object.create = function(prototype) {
		if (arguments.length > 1)
			throw new Error('Object.create: this implementation only accepts the first parameter.');
		function Func() {}
		Func.prototype = prototype;
		return new Func();
	};
}

if (!Array.isArray) {
	/**
		Polyfill for Array.isArray. Returns true if the specified object is an Array.
		
		@param {Object} prototype	The prototype to create a new object with
	*/
	Array.isArray = function(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	};
}
