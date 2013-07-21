var should = require('should');
var e = require('../lib/Exceptions');
DownloadTimeout = require('../lib/core/DownloadTimeoutTask');

var DownloadReader;
describe('DownloadTimeoutTask', function() {


	it('test time out', function(done) {
		var timeout;
		var threads = {
			start: 0,
			position: 0,
			end: 100
		};

		var options = {
			timeout: 0.1
		};

		var timer = new DownloadTimeout(threads, options);

		var callback = function(err, stopper) {

			if (err) {
				err.toString().should.equal(e(1001, options.timeout).toString());
				done();
			}
		};
		timer.execute('start', callback);
	});
});