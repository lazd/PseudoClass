var Class = require('../source/Class');
var ResigClass = require('./libs/Class.Resig');

module.exports = {
	name: 'Class definition',
	tests: {
		'Class.js': function() {
			var A = Class.extend({
				construct: function() {
					return 'test';
				}
			});
		},
		'Resig': function() {
			var A = ResigClass.extend({
				init: function() {
					return 'test';
				}
			});
		},
		'Native (new)': function() {
			var A = function() {};
			A.prototype.method = function() {
				return 'test';
			};

			var B = function() {};
			B.prototype = new A();
			B.prototype.method = function() {
				return A.prototype.method.call(this);
			};
		},
		'Native (Object.create)': function() {
			var A = function() {};
			A.prototype.method = function() {
				return 'test';
			};

			var B = function() {};
			B.prototype = Object.create(A.prototype);
			B.prototype.method = function() {
				return A.prototype.method.call(this);
			};
		}
	}
};