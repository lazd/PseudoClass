var Class = require('../source/Class');
var ResigClass = require('./libs/Class.Resig');

var ClassA = Class.extend({
	construct: function() {
		return 'test';
	}
});

var ResigA = ResigClass.extend({
	init: function() {
		return 'test';
	}
});

var NativeA = function() {
	this.construct();
};

NativeA.prototype.construct = function() {
	return 'test';
};

module.exports = {
	name: 'Instance creation',
	tests: {
		'PseudoClass': function() {
			var a = new ClassA();
		},
		'Resig': function() {
			var a = new ResigA();
		},
		'Native': function() {
			var a = new NativeA();
		}
	}
};