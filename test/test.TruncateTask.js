var mockery = require('./mock/mock.requires');
var should = require('should');

var TruncateTask;
describe('TruncateTask', function() {
	before(function() {
		mockery.enable({
			warnOnUnregistered: false
		});

		TruncateTask = require('../lib/core/TruncateAsyncTask');
	});

	after(function() {
		mockery.disable();
	});

	it('test execute method', function(done) {

		var truncateTask = new TruncateTask(mockery.Fake_FileDescriptor, 44);

		var callback = function(err, result) {
			result.should.equal('AAAA AAAA AAAA AAAA BBBB BBBB BBBB CCCC CCCC');
			done();
		};
		truncateTask.execute(callback);
	});
});