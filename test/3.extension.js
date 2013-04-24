var expect = require('chai').expect;
var Class = require('../source/Class');

describe('Class extension:', function() {
	var A;
	
	var method1 = function() {
		return 1;
	};
	var method2 = function() {
		return 2;
	};
	var method3 = function() {
		return 3;
	};
	var callSuper = function() {
		return this._super();
	};
	
	function test_method1(X) {
		var x = new X();
		expect(x.method1()).to.equal(1);
	}
	
	function test_method2(X) {
		var x = new X();
		expect(x.method2()).to.equal(2);
	}
	
	function test_method3(X) {
		var x = new X();
		expect(x.method3()).to.equal(3);
	}
	
	beforeEach(function(done) {
		// Start fresh by re-defining A before every test
		A = Class({
			toString: function() { return 'A'; },
			method1: method1
		});
		
		done();
	});

	describe('inheritance', function() {
		it('using A.extend()', function() {
			var B = A.extend({
				method2: method2
			});
			
			var C = B.extend({
				method3: method3
			});
			
			test_method1(C);
			test_method2(C);
			test_method3(C);
		});
		
		it('using Class({ extend: A })', function() {
			var B = Class({
				extend: A,
				method2: method2
			});
			
			var C = Class({
				extend: B,
				method3: method3
			});
			
			test_method1(C);
			test_method2(C);
			test_method3(C);
		});
	});
	
	describe('superclass methods', function() {
		it('should call overriding childclass method', function() {
			var B = A.extend({
				method1: method3
			});
			var b = new B();
			
			expect(b.method1()).to.equal(3);
		});
		
		it('should call superclass method with this._super()', function() {
			var B = A.extend({
				method1: function() {
					return this._super();
				}
			});
			
			var b = new B();
			
			expect(b.method1()).to.equal(1);
		});
		
		it('should call superclass method with this[\'_super\']()', function() {
			var B = A.extend({
				method1: function() {
					return this['_super']();
				}
			});
			
			var b = new B();
			
			expect(b.method1()).to.equal(1);
		});
		
		it('should throw when calling this._super() in method that does not override', function() {
			var B = A.extend({
				methodX: callSuper
			});
			
			var b = new B();
			
			expect(b.methodX).to.Throw();
		});
		
		it('should support this._super() for methods called without an instance', function() {
			var B = A.extend({
				method1: function() {
					return this._super()+1;
				}
			});
			
			expect(B.prototype.method1()).to.equal(2);
		});
	});
	
	describe('mixins', function() {
		var mixable = {
			method1: function() {
				return 1;
			},
			method2: function() {
				return 1;
			}
		};
		
		var mixable2 = {
			method2: function() {
				return 2;
			}
		};
		
		it('with mixin()', function() {
			var A = Class();
			var a = new A();
			
			a.mixin(mixable);
			
			expect(a.method1()).to.equal(1);
		});
		
		it('with properites.mixins', function() {
			var A = Class({
				mixins: [mixable, mixable2]
			});
			var a = new A();
			
			expect(a.method1()).to.equal(1);
			expect(a.method2()).to.equal(2);
		});
		
		it('this._super() within mixins', function() {
			var A = Class({
				toString: 'MixedUp',
				mixins: [
					{
						method1: function() {
							// Should call the method of the class
							return this._super()+'Mixed';
						}
					},
					{
						method1: function() {
							// Should call the method of the previous mixin
							return this._super()+'Again';
						}
					}
				],
				method1: function() {
					return 'Original';
				}
			});
			
			var a = new A();
			
			a.mixin({
				method1: function() {
					return this._super()+'Last';
				}
			});
			
			expect(a.method1()).to.equal('OriginalMixedAgainLast');
		});
	});
});
