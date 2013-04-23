var expect = require('chai').expect;
var Class = require('../source/Class');

describe('Class creation:', function() {
	var properties = {
		method1: function() { return 1; }
	};
	
	function test_method1(A) {
		var a = new A();
		expect(a.method1()).to.equal(1);
	}
	
	it('using Class.extend(properties)', function() {
		var A = Class.extend(properties);
		test_method1(A);
	});
	
	it('using Class(properties)', function() {
		var A = Class(properties);
		test_method1(A);
	});
	
	it('using new Class(properties)', function() {
		var A = new Class(properties);
		test_method1(A);
	});
});
