var expect = require('chai').expect;
var Class = require('../source/Class');

describe('Class identity:', function() {
	describe('constructor property', function() {
		it('should be set to the class that constructed the instance', function() {
			var A = Class();
			var B = A.extend();
			
			var b = new B();
			
			expect(b.constructor).to.equal(B);
		});
	});
	
	describe('instanceOf', function() {
		var A, B, C;
		
		beforeEach(function(done) {
			A = Class();
			B = A.extend();
			C = B.extend();
			
			done();
		});
		
		it('should be correct for direct instances of a class', function() {
			var a = new A();
			
			expect(a instanceof A).to.be.true;
		});
		
		it('should be correct for instances of a childclass created with new', function() {
			var c = new C();
			
			expect(c instanceof A).to.be.true;
			expect(c instanceof B).to.be.true;
			expect(c instanceof C).to.be.true;
		});
		
		it('should be correct for instances of a childclass created without new', function() {
			var c = C();
			
			expect(c instanceof A).to.be.true;
			expect(c instanceof B).to.be.true;
			expect(c instanceof C).to.be.true;
		});
	});
	
	describe('toString', function() {
		function test_toString(A) {
			var a = new A();
			
			expect(a+'').to.equal('A');
		}
		
		it('as a function', function() {
			var A = Class({
				toString: function() {
					return 'A';
				}
			});
			
			test_toString(A);
		});
		
		
		it('as a string', function() {
			var A = Class({
				toString: 'A'
			});
			
			test_toString(A);
		});
	});
});
