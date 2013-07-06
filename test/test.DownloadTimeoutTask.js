var should = require('should');
DownloadTimeout = require('../lib/core/DownloadTimeoutTask');

var DownloadReader;
describe('DownloadTimeoutTask', function() {


	it('test execute method', function(done) {
		var timeout;
		var threads = {
			start: 0,
			position: 0,
			end: 100
		};

		var options = {
			timeout: 10
		};

		var timer = new DownloadTimeout(threads, options);

		timer.callback = function(callback, timeout) {
			timeout.should.equal(options.timeout);
			done();
		};
		timer.execute();
	});
});