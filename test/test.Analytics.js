var should = require('should');
var Analytics = require('../lib/core/Analytics');
var ThreadsGenerator = require('../lib/core/ThreadsGenerator');

describe('Module: Analytics', function() {

	it('should be a function', function() {
		Analytics.should.be.a('function');
	});
	describe('Methods', function() {
		var properties = ['tick'];
		var analytics = new Analytics({
			threads: {}
		});
		properties.forEach(function(p) {
			it('should have method - ' + p, function() {
				analytics.should.have.property(p);
				analytics[p].should.be.a('function');
			});
		});
	});


	describe('Properties', function() {
		var properties = ['fileSize',
			'blockSize',
			'dataReceived',
			'downloadSize',
			'downloadSpeed',

			'completed',
			'threadCompleted',

			'remaining',
			'elapsedTime',
			'estimatedTime',
			'openConnections',
			'closedConnections',
			'failedConnections',
			'threads',

			'interval'];

		var analytics = new Analytics({
			threads: []
		});
		properties.forEach(function(p) {
			it('should have property - ' + p, function() {
				analytics.should.have.property(p);
			});

		});

	});

	describe('working', function() {

		ThreadsGenerator.create({
			count: 4,
			fileSize: 400
		});

		var analytics = new Analytics({
			threads: ThreadsGenerator.threads,
			interval: 3000
		});

		it('should have valid properties', function() {

			analytics.fileSize.should.equal(400);
			analytics.blockSize.should.equal(100);
			analytics.downloadSize.should.equal(400);
			analytics.interval.should.equal(3000);
			analytics.threads.should.equal(ThreadsGenerator.threads);

		});


		it('should have valid properties', function() {

			analytics.tick();
			analytics.elapsedTime.should.equal(3000);

		});

	});
});