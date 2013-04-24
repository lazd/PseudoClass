var Class = require('../source/Class');
var ResigClass = require('./libs/Class.Resig');

module.exports = {
	name: 'Instance Creation',
	tests: {
		'Class.js': function() {
			var A = Class.extend({
				construct: function() {
					return 'test';
				}
			});
	
			var a = new A();
		},
		'Resig': function() {
			var A = ResigClass.extend({
				init: function() {
					return 'test';
				}
			});
	
			var a = new A();
		},
		'Native': function() {
			var A = function() {
				this.construct();
			};
		
			A.prototype.construct = function() {
				return 'test';
			};
		
			var a = new A();
		}
	}
};