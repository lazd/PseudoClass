var Class = require('../../Class');

// A simple logger that colorizes output for the shell
module.exports = Class({
	toString: 'ColorLogger',
	
	// Extend logger
	extend: require('./Logger'),
	
	// Load the Colorizer mixin to gain the colorize method
	mixins: [require('./Colorizer')],
	
	doLog: function(message) {
		// Colorize the first argument if it's a string
		var args = this.args(arguments);
		var type = args[args.length-1];
		
		if (typeof args[0] === 'string') {
			if (type === 'warn')
				args[0] = '<yellow>'+args[0]+'</yellow>';
			if (type === 'error')
				args[0] = '<red>'+args[0]+'</red>';
		
			args[0] = this.colorize(args[0]);
		}
		
		// Apply the modified arguments to the doLog() method of the superclass
		this._super.apply(this, args);
	},
	
	getDate: function() {
		// Call the superclass' getDate() method, but wrap its output in bold tags
		return this.colorize('<b>'+this._super()+'</b>');
	}
});
