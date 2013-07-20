var mockery = require('./mock/mock.requires');
var should = require('should');

var DownloadWriter;
describe('DownloadWriter', function() {
	before(function() {
		mockery.enable({
			warnOnUnregistered: false
		});

		DownloadWriter = require('../lib/core/DownloadWriterAsyncTask');
	});

	after(function() {
		mockery.disable();
	});

	it('test execute method', function(done) {
		var dummyData = 'AAAA BBBB CCCC';
		var writer = new DownloadWriter(mockery.fileDescriptor);
		var callback = function(err, response) {

			response.dataLength.should.equal(dummyData.length);
			response.writePostion.should.equal(100);
			done();
		};
		writer.execute(dummyData, 100, callback);
	});
});