var Class = require('../../Class');

// A utility function used by getDate that is effectively private
// You could call zeroPad.call(this, num) to execute it as a private function in the context of the instance
var zeroPad = function(num) {
	return ('0'+num).slice(-2);
};

// A simple logger that includes the current date and time with messages
module.exports = Class({
	toString: 'Logger',
	
	// A default property
	// Since strings are mutable, it's ok to store them in the prototype
	type: 'log',
	
	// Store some options in our constructor
	// Normally, you might use something like _.extend({}, this.options, options) to set defaults
	construct: function(options) {
		this.type = options.type || this.type;
	},
	
	// Looks funny, but effectively does a console.log(date+message)
	doLog: function() {
		var args = this.args(arguments);
		args.unshift(this.getDate()+':');
		
		// Type is the last argument
		var type = args.pop();
		
		console[type].apply(console, args);
	},
	
	log: function() {
		this.doLog.apply(this, this.args(arguments).concat(this.type));
	},
	
	warn: function() {
		this.doLog.apply(this, this.args(arguments).concat('warn'));
	},
	
	error: function() {
		this.doLog.apply(this, this.args(arguments).concat('error'));
	},
	
	getDate: function() {
		var d = new Date();
		var dateStr = d.getUTCFullYear()+'-'+zeroPad(d.getUTCMonth()+1)+'-'+zeroPad(d.getUTCDate())+
					' '+zeroPad(d.getUTCHours())+':'+zeroPad(d.getUTCMinutes())+':'+zeroPad(d.getUTCSeconds())+'.'+zeroPad((d.getTime()/1000).toFixed(2));
		return dateStr;
	},
	
	args: function(obj) {
		return Array.prototype.slice.call(obj);
	}
});
