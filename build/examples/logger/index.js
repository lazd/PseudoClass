var Class = require('../../Class');
var ColorLogger = require('./ColorLogger');

// Create a couple loggers
var message = new ColorLogger({
	type: 'log'
});

var error = new ColorLogger({
	type: 'error'
});

// Log some messages
console.log(ColorLogger.prototype.colorize("<b>Class Example:</b> Logger"));
console.log(ColorLogger.prototype.colorize("<i>In this example, we'll use inheritance, mixins, this._super.apply(), default properties,\nprivate helper functions, and methods on the prototype of a Class without an instance.</i>\n"));

// Log some messages
message.warn('Starting...');

([1,2,3,4,5]).forEach(function(num) {
	setTimeout(function() {
		message.log('Counting '+num);
	}, num*200);
});

setTimeout(function() {
	error.log('Goodbye!');
	process.exit();
}, 1000);