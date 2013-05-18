var should = require('should');
var ThreadsGenerator = require('../lib/core/ThreadsGenerator');

describe('ThreadsGenerator class', function() {

	it('should be a function', function() {
		ThreadsGenerator.should.be.a('function');
	});
	var properties = ['threads', 'fileSize', 'blockSize', 'count'];
	it('should have properties: ' + properties.join(', '), function() {
		var threadsGenerator = new ThreadsGenerator({});
		properties.forEach(function(p) {
			threadsGenerator.should.have.property(p);
		});
	});


	it('should create threads', function() {
		var threadsGenerator = new ThreadsGenerator({
			count: 4,
			fileSize: 400
		});
		threadsGenerator.threads.should.have.lengthOf(4);
		threadsGenerator.count.should.equal(4);
		threadsGenerator.fileSize.should.equal(400);
		threadsGenerator.blockSize.should.equal(100);
	});

	it('should match positions', function() {
		var threadsGenerator = new ThreadsGenerator({
			count: 4,
			fileSize: 401
		});

		//Thread 0
		threadsGenerator.threads[0].start.should.equal(0);
		threadsGenerator.threads[0].position.should.equal(0);
		threadsGenerator.threads[0].end.should.equal(101);
		threadsGenerator.threads[0].connection.should.equal('open');


		//Thread 1
		threadsGenerator.threads[1].start.should.equal(102);
		threadsGenerator.threads[1].position.should.equal(102);
		threadsGenerator.threads[1].end.should.equal(202);
		threadsGenerator.threads[1].connection.should.equal('open');

		//Thread 2
		threadsGenerator.threads[2].start.should.equal(203);
		threadsGenerator.threads[2].position.should.equal(203);
		threadsGenerator.threads[2].end.should.equal(303);
		threadsGenerator.threads[2].connection.should.equal('open');


		//Thread 3
		threadsGenerator.threads[3].start.should.equal(304);
		threadsGenerator.threads[3].position.should.equal(304);
		threadsGenerator.threads[3].end.should.equal(401);
		threadsGenerator.threads[3].connection.should.equal('open');
	});

});