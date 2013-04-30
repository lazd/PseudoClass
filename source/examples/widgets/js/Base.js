// A useless base class that does nothing more than report when it is constructed or destructed
var Base = Class({
	toString: 'Base',
	construct: function(options) {
		console.log('Base: Constructing...');

		// Store options
		this.options = options || {};
	},
	destruct: function() {
		console.log('Base: Destructing...');
	}
});
