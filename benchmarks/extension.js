var Class = require('../source/Class');
var ResigClass = require('./libs/Class.Resig');

module.exports = {
	name: 'Class extension',
	tests: {
		'PseudoClass': function() {
			var A = Class.extend({
				method: function() {
					return 'test';
				}
			});

			var B = A.extend({
				method1: function() {
					return 'test';
				}
			});
		},
		'Resig': function() {
			var A = ResigClass.extend({
				method: function() {
					return 'test';
				}
			});
			
			var B = A.extend({
				method1: function() {
					return 'test';
				}
			});
		},
		'Native': function() {
			var A = function() {};
			A.prototype.method = function() {
				return 'test';
			};

			var B = function() {};
			B.prototype = new A();
			B.prototype.method1 = function() {
				return 'test';
			};
		}
	}
};