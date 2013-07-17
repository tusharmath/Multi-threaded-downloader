var mockery = require('./mock/mock.requires');
var should = require('should');

var FileHandler;
describe('FileHandler', function() {
	before(function() {
		mockery.enable({
			warnOnUnregistered: false
		});

		FileHandler = require('../lib/core/FileHandlerAsyncTask');
	});

	after(function() {
		mockery.disable();
	});

	it('test execute method', function() {
		var fileHandler = new FileHandler('/Dummy/path/file.txt');
		var descriptor;
		var callback = function(callback, fd) {
			descriptor = fd;
		};
		fileHandler.execute(callback);
		descriptor.should.be.eql(mockery.Fake_FileDescriptor);
	});
});