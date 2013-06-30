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
		var fileHandler = new FileHandler('/Users/temp/demo.json');
		var fileLoaded = false;
		var descriptor;
		fileHandler.callback = function(callback, fd) {
			fileLoaded = true;
			descriptor = fd;
		};
		fileHandler.execute();

		fileLoaded.should.be.ok;
		descriptor.should.be.eql(fileHandler.fd);
	});
});