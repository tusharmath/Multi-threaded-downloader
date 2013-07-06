var mockery = require('./mock/mock.requires');
var should = require('should');

var DownloadReader;
describe('DownloadReaderTask', function() {
	before(function() {
		mockery.enable({
			warnOnUnregistered: false
		});

		DownloadReader = require('../lib/core/DownloadReaderAsyncTask');
	});

	after(function() {
		mockery.disable();
	});

	it('test execute method', function() {
		var content;
		var dummyFileDescriptor = mockery.Fake_FileDescriptor;
		var options = {
			block: 4
		};
		var reader = new DownloadReader(dummyFileDescriptor, options);

		reader.callback = function(callback, blockContent) {
			content = blockContent;
		};

		reader.execute();
		reader.actualSize.should.equal(dummyFileDescriptor.content.length);
		content.should.equal('EEEE');
	});
});