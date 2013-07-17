var should = require('should');
var e = require('../lib/Exceptions');
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
            timeout: 100
        };

        var timer = new DownloadTimeout(threads, options);

        var callback = function(err, timeout) {
            timeout.should.equal(options.timeout);
            err.toString().should.equal(e(1001, options.timeout).toString());

            done();
        };
        timer.start(callback);
    });
});