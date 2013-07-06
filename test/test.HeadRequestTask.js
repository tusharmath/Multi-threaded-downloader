var mockery = require('./mock/mock.requires');
var should = require('should');

var HeadRequestTask;
describe('HeadRequestTask', function() {
	before(function() {
		mockery.enable({
			warnOnUnregistered: false
		});

		HeadRequestTask = require('../lib/core/HeadRequestAsyncTask');
	});

	after(function() {
		mockery.disable();
	});

	it('test execute method', function(done) {
		var req = new HeadRequestTask('http://random/dom');

		req.callback = function(err, data) {
			data.fileSize.should.equal(100);
			data.contentType.should.equal('text/html');
			done();
		};
		req.execute();

	});
});