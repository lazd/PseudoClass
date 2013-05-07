var Class = require('../source/Class');
var ResigClass = require('./libs/Class.Resig');

// Class
var ClassA = Class.extend({
	method: function() {
		return 'test';
	}
});
var ClassB = ClassA.extend({
	method: function(_super) {
		return _super.call(this);
	}
});
var ClassC = ClassB.extend({
	method: function(_super) {
		return _super.call(this);
	}
});
var ClassN = ClassC.extend({
	method: function(_super) {
		return _super.call(this);
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
	return NativeA.prototype.method.call(this);
};

var NativeC = function() {};
NativeC.prototype = new NativeB();
NativeC.prototype.method = function() {
	return NativeB.prototype.method.call(this);
};

var NativeN = function() {};
NativeN.prototype = new NativeC();
NativeN.prototype.method = function() {
	return NativeC.prototype.method.call(this);
};

module.exports = {
	name: 'Superclass methods',
	tests: {
		'PseudoClass': function() {
			var b = new ClassB();
			b.method();
		},
		'Resig': function() {
			var b = new ResigB();
			b.method();
		},
		'Native': function() {
			var b = new NativeN();
			b.method();
		}
	}
};
