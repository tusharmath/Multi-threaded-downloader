var should = require('should');
var mockery = require('./mock/mock.requires');
var DataBuilder = require('../lib/core/MetaDataBuilderSyncTask');
var ThreadGenerator = require('../lib/core/ThreadsGeneratorSyncTask');
var fd;

describe('MetaDataBuilderSyncTask', function() {
	var fileSize = 100;
	var url = 'http://a.com/b';


	var threadsGenerator = new ThreadGenerator(fileSize);
	threadsGenerator.execute();



	before(function() {
		mockery.enable({
			warnOnUnregistered: false
		});

		var FileHandler = require('../lib/core/FileHandlerAsyncTask');
		var fileHandler = new FileHandler('A/Dummy/Path');
		fileHandler.callback = function(fd) {
			fd = fd;
		};
		fileHandler.execute();

	});

	after(function() {
		mockery.disable();
	});


	it('test write position', function() {

		var builder = new DataBuilder(threadsGenerator.threads, '/Users/downloads/demo.pkg', 100, fd);
		var response;
		builder.callback = function(data) {
			response = data;
		};
		builder.execute();
		response.position.should.equal(100);

	});
});