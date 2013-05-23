exports.os = {
	tmpdir: function() {
		return '/Users/tusharmathur/desktop';
	}
};

exports.fs = {
	write: function(a, b, c, d, e, f) {
		f();
	},
	writeFile: function() {},
	open: function(a, b, c, d) {
		d(undefined, {});
	},
	ReadStream: function() {
		return {
			on: function(a, b) {
				b();
			}
		};
	}
};

exports.crypto = {
	createHash: function() {
		return {
			update: function() {},
			digest: function() {
				return 'xxxx';
			}
		};
	}
};
exports.url = {
	parse: function() {
		return {
			hostname: '',
			path: ''
		};
	}
};


exports.http = {
	globalAgent: {
		maxSockets: 0
	},
	Agent: {
		defaultMaxSockets: 0
	},
	get: function(a, b) {
		b({
			addListener: function(a, b) {
				if (a == 'end') {
					b();
				} else if (a == 'data') {
					b([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
				}
			}
		});
		return {
			on: function() {
				return {
					end: function() {}
				};
			}
		};
	},
	request: function(a, b) {
		b({
			headers: {
				'content-length': 100,
				'content-type': 'text/html'
			},
			destroy: function() {}
		});
		return {
			on: function() {
				return {
					end: function() {}
				};
			}
		};
	}
};