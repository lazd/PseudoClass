var expect = require('chai').expect;
var Class = require('../source/Class');

describe('Class statics:', function() {
	describe('methods', function() {
		it('using Class.staticMethod', function() {
			var A = Class.extend();
			A.staticMethod = function() {
				return 'Static method';
			};

			expect(A.staticMethod()).to.equal('Static method');
		});

		it('using instance.constructor.staticMethod', function() {
			var A = Class.extend();
			A.staticMethod = function() {
				return 'Static method';
			};

			var a = new A();

			expect(a.constructor.staticMethod()).to.equal('Static method');
		});

		it('of a parent class using Class.superConstructor', function() {
			var A = Class.extend();
			A.staticMethod = function() {
				return 'Static method';
			};

			var B = A.extend();

			expect(B.superConstructor.staticMethod()).to.equal('Static method');
		});

		it('of a parent class using instance.constructor.superConstructor', function() {
			var A = Class.extend();
			A.staticMethod = function() {
				return 'Static method';
			};

			var B = A.extend();

			var b = new B();

			expect(b.constructor.superConstructor.staticMethod()).to.equal('Static method');
		});

		it('chained across multiple parent classes on a class', function() {
			var A = Class.extend();
			A.staticMethod = function() {
				return 'Static method';
			};

			var B = A.extend();
			B.staticMethod = function() {
				return this.superConstructor.staticMethod();
			};

			var C = B.extend();
			C.staticMethod = function() {
				return this.superConstructor.staticMethod();
			};

			expect(C.staticMethod()).to.equal('Static method');
		});

		it('chained across multiple parent classes on an instance', function() {
			var A = Class.extend();
			A.staticMethod = function() {
				return 'Static method';
			};

			var B = A.extend();
			B.staticMethod = function() {
				return this.superConstructor.staticMethod();
			};

			var C = B.extend();
			C.staticMethod = function() {
				return this.superConstructor.staticMethod();
			};

			var c = new C();

			expect(c.constructor.staticMethod()).to.equal('Static method');
		});
	});

	describe('properties', function() {
		it('using Class.staticProperty', function() {
			var A = Class.extend();
			A.staticProperty = 'Static property';

			expect(A.staticProperty).to.equal('Static property');
		});

		it('using constructor.staticMethod', function() {
			var A = Class.extend();
			A.staticProperty = 'Static property';

			var a = new A();

			expect(a.constructor.staticProperty).to.equal('Static property');
		});

		it('of a parent class using Class.superConstructor', function() {
			var A = Class.extend();
			A.staticProperty = 'Static property';

			var B = A.extend();

			expect(B.superConstructor.staticProperty).to.equal('Static property');
		});

		it('of a parent class using instance.constructor.superConstructor', function() {
			var A = Class.extend();
			A.staticProperty = 'Static property';

			var B = A.extend();

			var b = new B();

			expect(b.constructor.superConstructor.staticProperty).to.equal('Static property');
		});

		it('of a grandparent class using chained superConstructor on a class', function() {
			var A = Class.extend();
			A.staticProperty = 'Static property';

			var B = A.extend();

			var C = B.extend();

			expect(C.superConstructor.superConstructor.staticProperty).to.equal('Static property');
		});

		it('of a grandparent class using chained superConstructor on an instance', function() {
			var A = Class.extend();
			A.staticProperty = 'Static property';

			var B = A.extend();

			var C = B.extend();

			var c = new C();

			expect(c.constructor.superConstructor.superConstructor.staticProperty).to.equal('Static property');
		});
	});
});
