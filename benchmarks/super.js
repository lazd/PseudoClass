var Class = require('../source/Class');
var ResigClass = require('./libs/Class.Resig');

module.exports = {
	name: 'Super methods',
	tests: {
		'Class': function() {
			var A = Class.extend({
				method: function() {
					return 'test';
				}
			});
			var B = A.extend({
				method: function() {
					return this._super();
				}
			});

			var b = new B();
			b.method();
		},
		'Resig': function() {
			var A = ResigClass.extend({
				method: function() {
					return 'test';
				}
			});
			var B = A.extend({
				method: function() {
					return this._super();
				}
			});

			var b = new B();
			b.method();
		},
		'Native': function() {
			var A = function() {};
			A.prototype.method = function() {
				return 'test';
			};

			var B = function() {};
			B.prototype = Object.create(A.prototype);
			B.prototype.method = function() {
				return A.prototype.method.call(this);
			};

			var b = new B();
			b.method();
		}
	}
};
