var Class = require('../../Class');

var escape = '\033[';

var open = {
	'black': 30,
	'red': 31,
	'green': 32,
	'yellow': 33,
	'blue': 34,
	'magenta': 35,
	'cyan': 36,
	'white': 37,
	'grey': 90,
	'bg-black': 40,
	'bg-red': 41,
	'bg-green': 42,
	'bg-yellow': 43,
	'bg-blue': 44,
	'bg-magenta': 45,
	'bg-cyan': 46,
	'bg-white': 47,
	'bg-grey': 100,
	'b': 1,
	'i': 3,
	'u': 4,
	'blink': 5,
	'reset': 0
};

var close = {
	'b': 22,
	'i': 23,
	'u': 24,
	'blink': 25,
	'reset': 0
};

// A mixin that provides the colorize method
module.exports = {
	colorize: function(message) {
		if (!message) return '';
		
		// maintain a stack of our current tags
		var stack = [];
	
		// replace each tag with the corresponding shell color code
		message = message.replace(/<([a-z\-]+)>|<\/([a-z\-]+)>/g, function(matchedString, openTag, closeTag) {
			var seq = '';
		
			if (open.hasOwnProperty(openTag) || open.hasOwnProperty(closeTag)) { // handle color tags
				if (openTag) {
					// Add open code for tag
					seq = escape+open[openTag]+'m';
			
					// Push the tag onto our stack
					stack.unshift(openTag);
				}
				else {
					// Colors just reset, so there is no close code
					var isColor = !close.hasOwnProperty(closeTag);
					var seqPart = isColor ? open.reset : close[closeTag];
				
					// Add close code for tag
					seq = escape+seqPart+'m';
			
					// Remove the closed tag from the stack if it's on the top
					if (stack[0] == closeTag) {
						stack.shift();
					}
			
					// If we reset the color, we need to re-add previous colors
					if (isColor) {
						for (var i = stack.length-1; i >= 0; i--) {
							seq += escape+open[stack[i]]+'m';
						}
					}
				}
			}
			else { // pass through unrecognized tags
				seq = matchedString;
			}
			
			return seq;
		});
	
		// Make sure we reset if there were unclosed tags
		if (stack.length) {
			message += escape+open.reset+'m';
		}
	
		return message;
	}
};
