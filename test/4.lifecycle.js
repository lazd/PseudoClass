var expect = require('chai').expect;
var Class = require('../source/Class');

describe('Class lifecycle:', function() {
	describe('constructors', function() {
		it('should be chained', function() {
			var A = Class({
				construct: function() {
					this.A = true;
				}
			});
			
			var B = A.extend({
				construct: function() {
					this.B = true;
				}
			});
			
			var b = new B();
			
			expect(b.A).to.be.true;
			expect(b.B).to.be.true;
		});
		
		it('should execute in the correct order (superclass first)', function() {
			var constructed = {};
			function handleConstruct(name) {
				constructed[name] = true;
				
				if (name === 'B' && !constructed['A'])
					throw new Error('B constructed before A');
			};
			
			var A = Class({
				construct: function() {
					handleConstruct('A');
				}
			});
			
			var B = A.extend({
				construct: function() {
					handleConstruct('B');
				}
			});
			
			var b = new B();
		});
		
		it('should get an empty object if the first argument to the constructor is undefined', function() {
			var A = Class({
				construct: function(options) {
					this.options = options;
				}
			});
			var a = new A();
			
			expect(a.options).to.be.an('object');
			expect(Object.keys(a.options).length).to.equal(0);
		});
	});
	
	describe('destructors', function() {
		it('should be chained', function() {
			var A = Class({
				destruct: function() {
					this.A = true;
				}
			});
			
			var B = A.extend({
				destruct: function() {
					this.B = true;
				}
			});
			
			var b = new B();
			b.destruct();
			
			expect(b.A).to.be.true;
			expect(b.B).to.be.true;
		});
		
		it('should execute in the correct order (childclass first)', function() {
			var destructed = {};
			function handleDestruct(name) {
				if (name === 'A' && !destructed['B'])
					throw new Error('A destructed before B');
				destructed[name] = true;
			};
			
			var A = Class({
				destruct: function() {
					handleDestruct('A');
				}
			});
			
			var B = A.extend({
				destruct: function() {
					handleDestruct('B');
				}
			});
			
			var b = new B();
			b.destruct();
		});
	});
	
	describe('init methods', function() {
		it('should be called after all constructors', function() {
			var A = Class({
				construct: function() {
					this.A = true;
				}
			});
			
			var B = A.extend({
				construct: function() {
					this.B = true;
				},
				init: function() {
					if (!this.A || !this.B)
						throw new Error('init called before constructors');
				}
			});
			
			var b = new B();
		});
		
		it('should not be chained', function() {
			var A = Class({
				init: function() {
					throw new Error('init was chained');
				}
			});
			
			var B = A.extend({
				init: function() {}
			});
			
			var b = new B();
		});
		
		it('should support use of this._super()', function() {
			var A = Class({
				init: function() {
					return 1;
				}
			});
			
			var B = A.extend({
				init: function() {
					expect(this._super()).to.equal(1);
				}
			});
			
			var b = new B();
		});
	});
});
