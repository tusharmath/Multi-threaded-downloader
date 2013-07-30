var mockery = require('mockery');

var dummyString = 'AAAA AAAA AAAA AAAA BBBB BBBB BBBB CCCC CCCC EEEE';

mockery.Fake_FileDescriptor = {
	content: dummyString
};

mockery.Fake_HttpBodyResponse = {
	content: dummyString,
	headers: {
		'content-length': 100,
		'content-type': 'text/html',
		'content-disposition': 'attachment; filename="10 Trips You NEED To Take In Your 20s.mp4"'
	}
};

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
	existsSync: function() {},
	fstat: function(fd, callback) {
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
			'is-fake': true,
			headers: mockery.Fake_HttpBodyResponse.headers,
			destroy: function() {},
			addListener: function(command, callback) {
				if (command == 'end') callback();
				else if (command == 'data') callback(mockery.Fake_HttpBodyResponse.content);
			}
		});
		return {
			on: function(cmd, onError) {
				onError('fake-error');
				return {
					end: function() {}
				};

			}
		};
	}
});


module.exports = mockery;