var expect = require('chai').expect;
var Class = require('../source/Class');

describe('Instance properties:', function() {
	describe('property definition', function() {
		it('basic properties', function() {
			var A = Class.extend({
				properties: {
					name: {
						value: 'PseudoClass',
						writable: false
					}
				}
			});

			var a = new A();

			expect(a.name).to.equal('PseudoClass');
		});

		it('properties with setters and getters', function() {
			var A = Class.extend({
				properties: {
					name: {
						set: function(name) {
							this._name = name;
						},
						get: function() {
							return this._name;
						}
					}
				}
			});

			var a = new A();
			a.name = 'PseudoClass';

			expect(a.name).to.equal('PseudoClass');
			expect(a._name).to.equal('PseudoClass');
		});

		it('properties with setters and getters as method strings', function() {
			var A = Class.extend({
				properties: {
					name: {
						set: 'setName',
						get: 'getName'
					}
				},
				setName: function(name) {
					this._name = name;
				},
				getName: function() {
					return this._name;
				}
			});

			var a = new A();
			a.name = 'PseudoClass';

			expect(a.name).to.equal('PseudoClass');
			expect(a._name).to.equal('PseudoClass');
		});

		it('properties with setters and getters as method strings with monkey-patching', function() {
			var A = Class.extend({
				properties: {
					name: {
						set: 'setName',
						get: 'getName'
					}
				}
			});

			var a = new A();

			// Add methods after instantiation
			A.prototype.setName = function(name) {
				this._name = name;
			};
			A.prototype.getName = function() {
				return this._name;
			};

			a.name = 'PseudoClass';

			expect(a.name).to.equal('PseudoClass');
			expect(a._name).to.equal('PseudoClass');
		});

		it('should not put properties on the prototype', function() {
			var A = Class.extend({
				properties: {
					name: {
						value: 'PseudoClass',
						writable: false
					}
				}
			});

			expect(A.properties).to.be.truthy;
			expect(A.prototype.properties).to.not.be.truthy;
		});
	});

	describe('property extension', function() {
		it('basic property extension', function() {
			var A = Class.extend({
				properties: {
					name: {
						value: 'PseudoClass',
						writable: false
					}
				}
			});

			var B = A.extend({
				properties: {
					name: {
						value: 'PseudoChildClass'
					}
				}
			});

			var b = new B();

			expect(b.name).to.equal('PseudoChildClass');

			// Test that lack of writability was preserved
			b.name = 'NewName';

			expect(b.name).to.equal('PseudoChildClass');
		});

		it('property setter override', function() {
			var A = Class.extend({
				properties: {
					name: {
						set: function(name) {
							this._name = name;
						},
						get: function() {
							return this._name;
						}
					}
				}
			});

			var B = A.extend({
				properties: {
					name: {
						set: function(name) {
							this._otherName = name;
						},
						get: function() {
							return this._otherName;
						}
					}
				}
			});

			var b = new B();
			b.name = 'PseudoClass';

			expect(b.name).to.equal('PseudoClass');
			expect(b._otherName).to.equal('PseudoClass');
			expect(b._name).to.be.undefined;
		});

		it('should not modify parent properities during extension', function() {
			var A = Class.extend({
				properties: {
					name: {
						writable: false,
						value: 'Original'
					}
				}
			});

			var B = A.extend({
				properties: {
					name: {
						value: 'New'
					}
				}
			});

			var b = new B();
			expect(A.properties.name.writable).to.equal(false);
			expect(A.properties.name.value).to.equal('Original');
			expect(B.properties.name.writable).to.equal(false);
			expect(B.properties.name.value).to.equal('New');
		});

		it('should inherit properties from parent if no properties are defined on the child', function() {
			var Parent = Class.extend({
				properties: {
					value: {
						set: function(value) { this._value = value; },
						get: function(value) { return this._value; }
					}
				}
			});

			var Child = Parent.extend({ properties: {} });

			var child = new Child();

			child.value = 1;

			expect(child._value).to.equal(1);
			expect(child.value).to.equal(1);
		});
	});
});
