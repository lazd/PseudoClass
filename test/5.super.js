var expect = require('chai').expect;
var Class = require('../source/Class');

describe('Calling super methods:', function() {
	var A;

	beforeEach(function(done) {
		// Start fresh by re-defining A before every test
		A = Class({
			toString: function() { return 'A'; },
			method1: function() {
				return 1;
			},
			method2: function() {
				return 2;
			}
		});

		done();
	});

	it('should call superclass method with _super()', function() {
		var B = A.extend({
			method1: function() {
				return this._super();
			}
		});

		var b = new B();

		expect(b.method1()).to.equal(1);
	});

	it('should call superclass method with _super() if intermediate class does not have method', function() {
		var B = A.extend({
		});

		var C = B.extend({
			method1: function() {
				return this._super();
			}
		});

		var c = new C();

		expect(c.method1()).to.equal(1);
	});

	it('should throw when calling _super() in method that does not override', function() {
		var B = A.extend({
			methodX: function() {
				return this._super();
			}
		});

		var b = new B();

		expect(b.methodX).to.Throw();
	});

	it('should support _super() for methods called without an instance', function() {
		var B = A.extend({
			method1: function() {
				return this._super()+1;
			}
		});

		expect(B.prototype.method1()).to.equal(2);
	});

	it('should support _super() with more than one argument', function() {
		var A = Class({
			add: function(a, b) {
				return a + b;
			}
		});

		var B = A.extend({
			add: function(a, b) {
				return this._super(a, b);
			}
		});

		var b = new B();

		expect(b.add(2, 4)).to.equal(6);
	});

	it('should support _super() asynchronously without manually setting context', function(done) {
		var B = A.extend({
			method1: function() {
				var _super = this._super;

				// Delay calling super for 100ms
				setTimeout(function() {
					expect(_super()).to.equal(1);
					done();
				}, 100);
			},
			method2: function() {
				return this._super();
			}
		});

		var b = new B();
		b.method1();
		expect(b.method2()).to.equal(2);
	});

	it('should support _super() within a single mixin on a class', function() {
		var A = Class({
			toString: 'MixedUp',
			method1: function() {
				return 'Original';
			},
			mixins: [
				{
					method1: function() {
						// Should call the method of the class
						return this._super()+'Mixed';
					}
				}
			]
		});

		var a = new A();

		expect(a.method1()).to.equal('OriginalMixed');
	});

	it('should support _super() within multiple mixins on class', function() {
		var A = Class({
			toString: 'MixedUp',
			method1: function() {
				return 'Original';
			},
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
				},
				{
					method1: function() {
						// Should call the method of the previous mixin
						return this._super()+'Twice';
					}
				}
			]
		});

		var a = new A();

		expect(a.method1()).to.equal('OriginalMixedAgainTwice');
	});


	it('should support _super() within a single mixin on an instance', function() {
		var A = Class({
			toString: 'MixedUp',
			method1: function() {
				return 'Original';
			}
		});

		var a = new A();

		a.mixin({
			method1: function() {
				// Should call the method of the class
				return this._super()+'Mixed';
			}
		});

		expect(a.method1()).to.equal('OriginalMixed');
	});

	it('should support _super() within multiple mixins on an instance', function() {
		var A = Class({
			toString: 'MixedUp',
			method1: function() {
				return 'Original';
			}
		});

		var a = new A();

		a.mixin({
			method1: function() {
				// Should call the method of the class
				return this._super()+'Mixed';
			}
		});

		a.mixin({
			method1: function() {
				// Should call the method of the previous mixin
				return this._super()+'Again';
			}
		});

		a.mixin({
			method1: function() {
				// Should call the method of the previous mixin
				return this._super()+'Twice';
			}
		});

		expect(a.method1()).to.equal('OriginalMixedAgainTwice');
	});

	it('should support _super() with mixins on class and instance', function() {
		var A = Class({
			mixins: [{
				method1: function() {
					return 'MixedFirst'
				}
			}]
		});

		var a = new A();

		a.mixin({
			method1: function() {
				return this._super()+'MixedLater';
			}
		});

		expect(a.method1()).to.equal('MixedFirstMixedLater');
	});

	it('should call the new function when using _super() in a class mixin method after prototype chain modified', function() {
		var A = Class({
			method1: function() {
				return 'Original';
			}
		});

		var B = A.extend({
			method1: function() {
				return this._super();
			}
		});

		A.prototype.method1 = function() {
			return 'New';
		};

		var b = new B();

		expect(b.method1()).to.equal('New');

		b.mixin({
			method1: function() {
				return 'MixedAgain'+this._super();
			}
		});

		expect(b.method1()).to.equal('MixedAgainNew');
	});

	it('should call the new function when using _super() in an instance mixin method after prototype chain modified', function() {
		var A = Class({
			method1: function() {
				return 'Original';
			}
		});

		var a = new A();

		A.prototype.method1 = function() {
			return 'New';
		};

		a.mixin({
			method1: function() {
				return 'Mixed'+this._super();
			}
		});

		expect(a.method1()).to.equal('MixedNew');
	});

	it('should pass correct arguments when using _super.apply()', function() {
		var A = Class({
			method1: function(num) {
				expect(num).to.equal(5);
			}
		});

		var B = A.extend({
			method1: function(number) {
				return this._super.apply(this, arguments);
			}
		});

		var b = new B();

		b.method1(5);
	});

	it('should pass correct arguments when using _super.apply() with mixins on a class', function() {
		var A = Class({
			method1: function(num) {
				expect(num).to.equal(5);
				return num;
			}
		});

		var B = A.extend({
			method1: function() {
				return this._super.apply(this, arguments)+1;
			},
			mixins: [
				{
					method1: function() {
						return this._super.apply(this, arguments)+1;
					}
				}, 
				{
					method1: function() {
						return this._super.apply(this, arguments)+1;
					}
				}
			]
		});

		var b = new B();

		expect(b.method1(5)).to.equal(8);
	});

	it('should pass correct arguments when using _super.apply() with mixins on an instance', function() {
		var A = Class({
			method1: function(num) {
				expect(num).to.equal(5);
				return num;
			}
		});

		var B = A.extend({
			method1: function() {
				return this._super.apply(this, arguments)+1;
			}
		});

		var b = new B();

		b.mixin({
			method1: function() {
				return this._super.apply(this, arguments)+1;
			}
		});

		b.mixin({
			method1: function() {
				return this._super.apply(this, arguments)+1;
			}
		});

		expect(b.method1(5)).to.equal(8);
	});


	it('should have this set to the correct value when using _super()', function() {
		var A = Class({
			method1: function(num) {
				expect(this).to.equal(b);
				return num;
			}
		});

		var B = A.extend({
			method1: function() {
				expect(this).to.equal(b);
				return this._super();
			}
		});

		var b = new B();

		b.method1();
	});



	it('should have this set to the correct value when using _super.apply(this)', function() {
		var A = Class({
			method1: function(num) {
				expect(this).to.equal(b);
				return num;
			}
		});

		var B = A.extend({
			method1: function() {
				expect(this).to.equal(b);
				return this._super.apply(this, arguments);
			}
		});

		var b = new B();

		b.method1();
	});

	it('should have this set to the correct value when using _super.apply(this) and a single mixin', function() {
		var A = Class({
			method1: function(num) {
				expect(this).to.equal(b);
				return num;
			}
		});

		var B = A.extend({
			method1: function() {
				expect(this).to.equal(b);
				return this._super.apply(this, arguments);
			}
		});

		var b = new B();

		b.mixin({
			method1: function() {
				expect(this).to.equal(b);
				return this._super.apply(this, arguments);
			}
		});

		b.mixin({
			method1: function() {
				expect(this).to.equal(b);
				return this._super.apply(this, arguments);
			}
		});

		b.method1();
	});

	it('should have this set to the correct value when using _super.apply(this) and multiple mixins', function() {
		var A = Class({
			method1: function(num) {
				expect(this).to.equal(b);
				return num;
			}
		});

		var B = A.extend({
			method1: function() {
				expect(this).to.equal(b);
				return this._super.apply(this, arguments);
			}
		});

		var b = new B();

		b.mixin({
			method1: function() {
				expect(this).to.equal(b);
				return this._super.apply(this, arguments);
			}
		});

		b.mixin({
			method1: function() {
				expect(this).to.equal(b);
				return this._super.apply(this, arguments);
			}
		});

		b.method1();
	});

});
