var Class = require('../source/Class');
var ResigClass = require('./libs/Class.Resig');

module.exports = {
	name: 'Class definition',
	tests: {
		'PseudoClass': function() {
			var A = Class.extend({
				method: function() {
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
		},
		'Native': function() {
			var A = function() {};
			A.prototype.method = function() {
				return 'test';
			};
		}
	}
};