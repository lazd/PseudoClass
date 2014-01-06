// A basic alert widget
// We'll extend the Widget using the alternate Widget.extend() static method
var Alert = Widget.extend({
	toString: function() {
		// Call the superclass' toString() method
		return this._super()+'->Modal';
	},

	// We'll define an init function that uses our method to setup the alert
	init: function() {
		console.log(this+': Initializing...');
		
		// init() isn't chained, so call the superclass init method
		this._super.apply(this, arguments);
		
		if (this.options.heading)
			this.setHeading(this.options.heading);
		
		if (this.options.message)
			this.setMessage(this.options.message);
		
		this.$el.on('click', '[data-close]', function(evt) {
			evt.preventDefault();
			this.hide();
		}.bind(this));
	},
	
	// Override the default show method to shake the alert when shown
	show: function() {
		console.log(this+': Showing');
		
		// First call the superclass' show method
		this._super();
		
		// Position in the center of the screen
		this.$el.css({
			marginTop: -this.$el.outerHeight()/2,
			marginLeft: -this.$el.outerWidth()/2
		});

		// Then shake the alert
		this.shake();
	},
	
	shake: function() {
		var by = 20;
		for (var i = 0; i < 4; i++) {
			this.$el.animate({
				marginLeft: '+='+(by = -by)+'px'
			}, 35);
		}
	},
	
	// Override the default hide method to fade the dialog out
	hide: function() {
		console.log(this+': Hiding');
		
		this.$el.fadeOut(250);
	},
	
	setHeading: function(heading) {
		this.$el.find('.alert-heading').html(heading);
	},
	
	setMessage: function(message) {
		this.$el.find('.alert-message').html(message);
	}
});
