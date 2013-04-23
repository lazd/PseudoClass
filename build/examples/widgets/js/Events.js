// A very basic events mixin
var Events = {
	on: function(name, func) {
		this._events = this._events || {};
		this._events[name] = this._events[name] || [];
		this._events[name].push(func);
	},
	off: function(name, func) {
		this._events = this._events || {};
		var index = this._events[name] && this._events[name].indexOf(func) || -1;
		if (~index)
			this._events.splice(index, 1);
	},
	trigger: function(name, properties) {
		if (!this._events || !this._events[name]) return;
		for (var i = 0; i < this._events[name].length; i++) {
			this._events[name][i].call(this, properties);
		}
	}
};
