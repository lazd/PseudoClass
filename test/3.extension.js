var expect = require('chai').expect;
var Class = require('../source/Class');

describe('Class extension:', function() {
	var A;

	var return1 = function() {
		return 1;
	};
	var return2 = function() {
		return 2;
	};
	var return3 = function() {
		return 3;
	};
	var callSuper = function(_super) {
		return _super.call(this);
	};

	function test_return1(X) {
		var x = new X();
		expect(x.return1()).to.equal(1);
	}

	function test_return2(X) {
		var x = new X();
		expect(x.return2()).to.equal(2);
	}

	function test_return3(X) {
		var x = new X();
		expect(x.return3()).to.equal(3);
	}

	beforeEach(function(done) {
		// Start fresh by re-defining A before every test
		A = Class({
			toString: function() { return 'A'; },
			return1: return1
		});

		done();
	});

	describe('inheritance', function() {
		it('using A.extend()', function() {
			var B = A.extend({
				return2: return2
			});

			var C = B.extend({
				return3: return3
			});

			test_return1(C);
			test_return2(C);
			test_return3(C);
		});

		it('using Class({ extend: A })', function() {
			var B = Class({
				extend: A,
				return2: return2
			});

			var C = Class({
				extend: B,
				return3: return3
			});

			test_return1(C);
			test_return2(C);
			test_return3(C);
		});

		it('should call overriding child class method', function() {
			var B = A.extend({
				return1: function() {
					return 3;
				}
			});
			var b = new B();

			// Child class method should override and return 3
			expect(b.return1()).to.equal(3);
		});
	});

	describe('mixins', function() {
		var mixable = {
			return1: function() {
				return 1;
			},
			return2: function() {
				return 1;
			}
		};

		var mixable2 = {
			return2: function() {
				return 2;
			}
		};

		it('with mixin() on an instance', function() {
			var A = Class();
			var a = new A();

			a.mixin(mixable);

			expect(a.return1()).to.equal(1);
		});

		it('with properites.mixins at declaration time', function() {
			var A = Class({
				mixins: [mixable, mixable2]
			});
			var a = new A();

			expect(a.return1()).to.equal(1);
			expect(a.return2()).to.equal(2);
		});

		it('at declaration and instance time', function() {
			var A = Class({
				mixins: [mixable]
			});

			var a = new A();

			a.mixin(mixable2);

			expect(a.return1()).to.equal(1);
			expect(a.return2()).to.equal(2);
		});

		it('modifying the prototype should override mixins added at declaration time', function() {
			var A = Class({
				return1: function() {
					return 'Original';
				},
				mixins: [{
					return1: function(_super) {
						return 'Mixed'+_super.call(this);
					}
				}]
			});

			A.prototype.return1 = function() {
				return 'New';
			};

			var a = new A();

			expect(a.return1()).to.equal('New');
		});
	});
});
