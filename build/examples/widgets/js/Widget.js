// A widget class that handles showing, hiding, and removing an element from the DOM
var Widget = Class({
	// Identify ourself
	toString: function() {
		// Using the superclass, Base's toString() method
		return this._super()+'->Widget';
	},
	
	// Extend the Base class
	extend: Base,
	
	// Add the Events mixin
	mixins: [Events],
	
	// construct() is chained, so we will first see the log entries made by Base
	construct: function(options) {
		console.log(this.widgetToString()+': Constructing...');
		
		this.$el = $(options.el);
	},
	
	// destruct() is chained, but we'll see Widget's log entries first
	destruct: function() {
		console.log('Widget: Destructing...');
		
		this.$el.remove();
	},
	
	// The init() method is called after all constructors have been executed
	init: function() {
		if (this.options.visible) {
			this.show();
		}
		else {
			// Call Widget's hide() method, regardless of overrides by a sub-class
			Widget.prototype.hide.call(this);
		}
	},
	
	widgetToString: function() {
		// Call Widget's toString() method, regardless of overrides by a sub-class
		return Widget.prototype.toString.call(this);
	},

	show: function() {
		console.log(this.widgetToString()+': Showing');
		
		this.trigger('shown');
		
		this.$el.show();
	},
	
	hide: function() {
		console.log(this.widgetToString()+': Hiding');
		
		this.trigger('hidden');
		
		this.$el.hide();
	}
});
