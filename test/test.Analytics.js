var should = require('should');
var Factory = require('../lib/utils/Factory');
Factory.register([{
	Analytics: {}
}, {
	ThreadsGenerator: {
		isSingleton: true
	}
}]);

describe('Module: Analytics', function() {

	describe('Methods:', function() {
		var methods = ['tick'];

		var analytics = Factory.create('Analytics');
		it('should have methods - ' + methods.join(', '), function() {
			methods.forEach(function(p) {
				analytics.should.have.property(p);
				analytics[p].should.be.a('function');
			});
		});
	});


	describe('Properties:', function() {
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

		var analytics = Factory.create('Analytics');
		var threadGenerator = Factory.create('ThreadsGenerator');

		analytics.threads = threadGenerator.threads;
		analytics.tick();
		it('should have properties - ' + properties.join(', '), function() {
			properties.forEach(function(p) {
				analytics.should.have.property(p);
			});
		});
	});


	describe('Working:', function() {
		it('should have valid properties', function() {
			var ThreadsGenerator = Factory.create('ThreadsGenerator', {
				fileSize: 400,
				count: 4
			}, true);

			var analytics = Factory.create('Analytics');
			analytics.interval = 3000;
			analytics.threads = ThreadsGenerator.threads;

			analytics.tick();
			analytics.fileSize.should.equal(400);
			analytics.blockSize.should.equal(100);
			analytics.downloadSize.should.equal(400);

			analytics.tick();

			analytics.interval.should.equal(3000);
			analytics.elapsedTime.should.equal(6000);

			analytics.threads.should.eql(ThreadsGenerator.threads);

		});

		it('should show open connections', function() {
			var threadsGenerator = Factory.create('ThreadsGenerator', {
				count: 4
			}, true);

			threadsGenerator.threads[1].connection = 'closed';
			threadsGenerator.threads[2].connection = 'failed';

			var analytics = Factory.create('Analytics');
			analytics.threads = threadsGenerator.threads;
			analytics.tick();
			analytics.closedConnections.should.equal(1);
			analytics.openConnections.should.equal(2);
			analytics.failedConnections.should.equal(1);


		});

	});
});