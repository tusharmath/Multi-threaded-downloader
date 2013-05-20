exports.os = {
	tmpdir: function() {
		return '/Users/tusharmathur/desktop';
	}
};

exports.fs = {
	write: function(a, b, c, d, e, f) {
		f();
	},
	open: function(a, b, c, d) {
		d(undefined, {});
	}
};