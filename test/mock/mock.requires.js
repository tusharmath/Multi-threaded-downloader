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