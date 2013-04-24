var Class = require('../source/Class');
var ResigClass = require('./libs/Class.Resig');

// Class
var ClassA = Class.extend({
	method: function() {
		return 'test';
	}
});
var ClassB = ClassA.extend({
	method: function() {
		return this._super();
	}
});

// Resig
var ResigA = ResigClass.extend({
	method: function() {
		return 'test';
	}
});
var ResigB = ResigA.extend({
	method: function() {
		return this._super();
	}
});

// Navtive
var NativeA = function() {};
NativeA.prototype.method = function() {
	return 'test';
};

var NativeB = function() {};
NativeB.prototype = new NativeA();
NativeB.prototype.method = function() {
	return NativeA.prototype.method.call(this);
};

module.exports = {
	name: 'Superclass methods',
	tests: {
		'Class.js': function() {
			var b = new ClassB();
			b.method();
		},
		'Resig': function() {
			var b = new ResigB();
			b.method();
		},
		'Native: new': function() {
			var b = new NativeB();
			b.method();
		}
	}
};
