var Class = require('../source/Class');
var ResigClass = require('./libs/Class.Resig');

// PseudoClass
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
var ClassC = ClassB.extend({
	method: function() {
		return this._super();
	}
});
var ClassN = ClassC.extend({
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
var ResigC = ResigB.extend({
	method: function() {
		return this._super();
	}
});
var ResigN = ResigC.extend({
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
	return NativeA.prototype.method.apply(this, arguments);
};

var NativeC = function() {};
NativeC.prototype = new NativeB();
NativeC.prototype.method = function() {
	return NativeB.prototype.method.apply(this, arguments);
};

var NativeN = function() {};
NativeN.prototype = new NativeC();
NativeN.prototype.method = function() {
	return NativeC.prototype.method.apply(this, arguments);
};

var nativeN = new NativeN();
var resigN = new ResigN();
var pseudoClassN = new ClassN();

module.exports = {
	name: 'Superclass methods',
	tests: {
		'PseudoClass': function() {
			pseudoClassN.method();
		},
		'Resig': function() {
			resigN.method();
		},
		'Native': function() {
			nativeN.method();
		}
	}
};
