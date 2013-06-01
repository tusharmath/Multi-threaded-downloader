var should = require('should');
var Factory = require('../lib/utils/Factory');
Factory.register('ThreadsGenerator', 'singleton');



describe('Module: ThreadsGenerator', function() {


	describe('properties', function() {

		var properties = ['threads', 'fileSize', 'blockSize', 'count', 'states'];
		var threadsGenerator = Factory.create('ThreadsGenerator');

		it('should have properties - ' + properties.join(', '), function() {
			properties.forEach(function(p) {
				threadsGenerator.should.have.property(p);
			});
		});


	});



	it('should have valid properties after initialization', function() {
		var threadsGenerator = Factory.create('ThreadsGenerator', {
			count: 4,
			fileSize: 400
		}, true);

		threadsGenerator.threads.should.have.lengthOf(4);
		threadsGenerator.count.should.equal(4);
		threadsGenerator.fileSize.should.equal(400);
		threadsGenerator.blockSize.should.equal(100);

	});

	it('should have thread states', function() {
		var threadsGenerator = Factory.create('ThreadsGenerator');
		threadsGenerator.states.should.have.keys('open', 'closed', 'failed');
	});

	it('should match thread specs', function() {

		var threadsGenerator = Factory.create('ThreadsGenerator', {
			count: 4,
			fileSize: 401
		}, true);

		//Thread 0
		threadsGenerator.threads[0].start.should.equal(0);
		threadsGenerator.threads[0].position.should.equal(0);
		threadsGenerator.threads[0].end.should.equal(101);
		threadsGenerator.threads[0].connection.should.equal('open');
		threadsGenerator.threads[0].header.should.equal('bytes=0-101');


		//Thread 1
		threadsGenerator.threads[1].start.should.equal(102);
		threadsGenerator.threads[1].position.should.equal(102);
		threadsGenerator.threads[1].end.should.equal(202);
		threadsGenerator.threads[1].connection.should.equal('open');
		threadsGenerator.threads[1].header.should.equal('bytes=102-202');

		//Thread 2
		threadsGenerator.threads[2].start.should.equal(203);
		threadsGenerator.threads[2].position.should.equal(203);
		threadsGenerator.threads[2].end.should.equal(303);
		threadsGenerator.threads[2].connection.should.equal('open');
		threadsGenerator.threads[2].header.should.equal('bytes=203-303');

		//Thread 3
		threadsGenerator.threads[3].start.should.equal(304);
		threadsGenerator.threads[3].position.should.equal(304);
		threadsGenerator.threads[3].end.should.equal(401);
		threadsGenerator.threads[3].connection.should.equal('open');
		threadsGenerator.threads[3].header.should.equal('bytes=304-401');

	});

});