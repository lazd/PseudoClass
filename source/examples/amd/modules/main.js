// Configure RequireJS
requirejs.config({
	paths: {
		Class: [
			//'http://some.cdn.org/class/Class.js',	// A CDN URL can go here, with a local fallback URL below
			'../../../Class'
		]
	}
});

// Load our logger module, which depends on Class
require(['Logger'], function(Logger) {
	// Create an instance of our module
	var logger = new Logger();

	// Verify that Class has not leaked globally
	if (typeof window.Class === 'undefined') {
		logger.log('window.Class is undefined');
	}
	else {
		// This will never happen
		logger.error('window.Class is defined');
	}
	
	// Application code goes here!
	logger.log('Application started');
	
	var logType = 'log';
	document.getElementById('log_error').onclick = function(evt) {
		logType = 'error';
	};
	
	document.getElementById('doLog').onsubmit = function(evt) {
		var message = document.getElementById('log_message').value || '(no message)';
		// Log the message
		logger[logType](message);
		
		// Reset log field and type
		document.getElementById('log_message').value = '';
		logType = 'log';

		// Cancel form submit
		return false;
	};
});