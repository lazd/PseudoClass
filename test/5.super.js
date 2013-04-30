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
			method1: function(_super) {
				return _super.call(this);
			}
		});

		var b = new B();

		expect(b.method1()).to.equal(1);
	});

	it('should throw when calling _super() in method that does not override', function() {
		var B = A.extend({
			methodX: function(_super) {
				return _super.call(this);
			}
		});

		var b = new B();

		expect(b.methodX).to.Throw();
	});

	it('should support _super() for methods called without an instance', function() {
		var B = A.extend({
			method1: function(_super) {
				return _super.call(this)+1;
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
			add: function(_super, a, b) {
				return _super.call(this, a, b);
			}
		});

		var b = new B();

		expect(b.add(2, 4)).to.equal(6);
	});

	it('should support _super() asynchronously', function() {
		var B = A.extend({
			method1: function(_super) {
				var self = this;

				// Delay calling super for 100ms
				setTimeout(function() {
					expect(_super.call(self)).to.equal(1);
				}, 100);
			},
			method2: function(_super) {
				return _super.call(this);
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
					method1: function(_super) {
						// Should call the method of the class
						return _super.call(this)+'Mixed';
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
					method1: function(_super) {
						// Should call the method of the class
						return _super.call(this)+'Mixed';
					}
				},
				{
					method1: function(_super) {
						// Should call the method of the previous mixin
						return _super.call(this)+'Again';
					}
				},
				{
					method1: function(_super) {
						// Should call the method of the previous mixin
						return _super.call(this)+'Twice';
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
			method1: function(_super) {
				// Should call the method of the class
				return _super.call(this)+'Mixed';
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
			method1: function(_super) {
				// Should call the method of the class
				return _super.call(this)+'Mixed';
			}
		});

		a.mixin({
			method1: function(_super) {
				// Should call the method of the previous mixin
				return _super.call(this)+'Again';
			}
		});

		a.mixin({
			method1: function(_super) {
				// Should call the method of the previous mixin
				return _super.call(this)+'Twice';
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
			method1: function(_super) {
				return _super.call(this)+'MixedLater';
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
			method1: function(_super) {
				return _super.call(this);
			}
		});

		A.prototype.method1 = function() {
			return 'New';
		};

		var b = new B();

		expect(b.method1()).to.equal('New');

		b.mixin({
			method1: function(_super) {
				return 'MixedAgain'+_super.call(this);
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
			method1: function(_super) {
				return 'Mixed'+_super.call(this);
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
			method1: function(_super, number) {
				return _super.apply(this, arguments);
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
			method1: function(_super) {
				return _super.apply(this, arguments)+1;
			},
			mixins: [
				{
					method1: function(_super) {
						return _super.apply(this, arguments)+1;
					}
				}, 
				{
					method1: function(_super) {
						return _super.apply(this, arguments)+1;
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
			method1: function(_super) {
				return _super.apply(this, arguments)+1;
			}
		});

		var b = new B();

		b.mixin({
			method1: function(_super) {
				return _super.apply(this, arguments)+1;
			}
		});

		b.mixin({
			method1: function(_super) {
				return _super.apply(this, arguments)+1;
			}
		});

		expect(b.method1(5)).to.equal(8);
	});


	it('should have this set to the correct value when using _super.call(this)', function() {
		var A = Class({
			method1: function(num) {
				expect(this).to.equal(b);
				return num;
			}
		});

		var B = A.extend({
			method1: function(_super) {
				expect(this).to.equal(b);
				return _super.call(this);
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
			method1: function(_super) {
				expect(this).to.equal(b);
				return _super.apply(this, arguments);
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
			method1: function(_super) {
				expect(this).to.equal(b);
				return _super.apply(this, arguments);
			}
		});

		var b = new B();

		b.mixin({
			method1: function(_super) {
				expect(this).to.equal(b);
				return _super.apply(this, arguments);
			}
		});

		b.mixin({
			method1: function(_super) {
				expect(this).to.equal(b);
				return _super.apply(this, arguments);
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
			method1: function(_super) {
				expect(this).to.equal(b);
				return _super.apply(this, arguments);
			}
		});

		var b = new B();

		b.mixin({
			method1: function(_super) {
				expect(this).to.equal(b);
				return _super.apply(this, arguments);
			}
		});

		b.mixin({
			method1: function(_super) {
				expect(this).to.equal(b);
				return _super.apply(this, arguments);
			}
		});

		b.method1();
	});

});
