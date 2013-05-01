define(['Class'], function(Class) {
	var Logger = Class({
		toString: 'Logger',
		construct: function(options) {
			options = options || {};

			// Pull an option from the options object
			this.width = options.width || 40;
			
			this.log(this+' constructed');
		},
		doLog: function(message, type, noNewline) {
			// Add some dots
			while(message.length < 40)
				message += '.';
			
			var mark = '✔';
			if (type === 'error')
				mark = '✖';
			
			// Add the checkmark/X
			message += mark;
			
			if (type === 'error')
				message = '<span class="error">'+message+'</span>';
			
			// Add the message to the DOM
			document.getElementById('log').innerHTML += noNewline ? message : message + '\n';
		},
		log: function(message, noNewline) {
			this.doLog(message, 'log', noNewline);
		},
		error: function(message, noNewline) {
			this.doLog(message, 'error', noNewline);
		}
	});
	
	Logger.prototype.log('Class loaded with RequireJS');
	
	return Logger;
});