var mockery = require('mockery');

mockery.registerMock('os', {
	tmpdir: function() {
		return '/Users/tusharmathur/desktop';
	}
});

mockery.registerMock('fs', {
	ftruncate: function(fd, fileSize, callback) {
		callback(null, fd.content.slice(0, fileSize));
	},
	write: function(a, b, c, d, e, f) {
		f();
	},
	open: function(a, b, c, callback) {
		callback(undefined, mockery.Fake_FileDescriptor);
	},
	fstat: function(fd, callback) {
		//console.log(fd.content.length);
		callback(null, {
			size: fd.content.length
		});
	},
	read: function(fd, buffer, start, end, postion, callback) {
		var blockContent = JSON.stringify(fd.content.slice(postion));

		callback(null, null, new Buffer(blockContent));
	},
	unlink: function(a, b) {
		b();
	},
	ReadStream: function() {
		return {
			on: function(a, b) {
				b();
			}
		};
	}
});

mockery.registerMock('http', {
	globalAgent: {
		maxSockets: 0
	},
	Agent: {
		defaultMaxSockets: 0
	},

	request: function(requestOptions, onStart) {
		onStart({
			headers: {
				'content-length': 100,
				'content-type': 'text/html'
			},
			destroy: function() {},
			addListener: function(command, callback) {
				if (command == 'end') callback();
				else if (command == 'data') callback(mockery.Fake_HttpBodyResponse.content);
			}
		});
		return {
			on: function() {
				return {
					end: function() {}
				};
			}
		};
	}
});
var dummyString = 'AAAA AAAA AAAA AAAA BBBB BBBB BBBB CCCC CCCC EEEE';
mockery.Fake_FileDescriptor = {
	content: dummyString
};
mockery.Fake_HttpBodyResponse = {
	content: dummyString
};

module.exports = mockery;