var should = require('should');
var _ = require('underscore');
var u = require('../lib/Utils');
var fake = function() {};

var ThreadsDestroyer = require('../lib/core/ThreadsDestroyer');
describe('ThreadsDestroyer', function() {

	it('destroy only open connection', function(done) {

		var destroyCount = 0;
		var destroy = function() {
			destroyCount++;
		};

		var threads = [{
			connection: 'closed',
			destroy: destroy

		}, {
			connection: 'failed',
			destroy: destroy

		}, {
			connection: 'open',
			destroy: destroy

		}];

		u.executor(ThreadsDestroyer, threads)(function(err) {
			destroyCount.should.equal(1);
			should.not.exist(err);
			done();
		});
	});

});