var should = require('should');
var ThreadsGenerator = require('../lib/core/ThreadsGenerator');

describe('Module: ThreadsGenerator', function() {
	afterEach(function() {
		ThreadsGenerator.destroy = true;
	});

	it('should be an object', function() {
		ThreadsGenerator.should.be.a('object');
	});

	describe('properties', function() {

		var properties = ['threads', 'fileSize', 'blockSize', 'count', 'create', 'destroy', 'states'];
		ThreadsGenerator.create({});
		it('should have properties - ' + properties.join(', '), function() {
			properties.forEach(function(p) {
				ThreadsGenerator.should.have.property(p);
			});
		});


	});

	it('should be of singleton type', function() {
		ThreadsGenerator.create({});
		var t1 = ThreadsGenerator;
		ThreadsGenerator.create({});
		var t2 = ThreadsGenerator;
		t1.should.equal(t2);

	});


	it('should have valid properties after initialization', function() {
		ThreadsGenerator.create({
			count: 4,
			fileSize: 400
		});
		ThreadsGenerator.threads.should.have.lengthOf(4);
		ThreadsGenerator.count.should.equal(4);
		ThreadsGenerator.fileSize.should.equal(400);
		ThreadsGenerator.blockSize.should.equal(100);

	});

	it('should have thread states', function() {
		ThreadsGenerator.states.should.have.keys('open', 'closed', 'failed');
	});

	it('should match thread specs', function() {
		var threadsGenerator = ThreadsGenerator.create({
			count: 4,
			fileSize: 401
		});

		//Thread 0
		ThreadsGenerator.threads[0].start.should.equal(0);
		ThreadsGenerator.threads[0].position.should.equal(0);
		ThreadsGenerator.threads[0].end.should.equal(101);
		ThreadsGenerator.threads[0].connection.should.equal('open');
		ThreadsGenerator.threads[0].header.should.equal('bytes=0-101');


		//Thread 1
		ThreadsGenerator.threads[1].start.should.equal(102);
		ThreadsGenerator.threads[1].position.should.equal(102);
		ThreadsGenerator.threads[1].end.should.equal(202);
		ThreadsGenerator.threads[1].connection.should.equal('open');
		ThreadsGenerator.threads[1].header.should.equal('bytes=102-202');

		//Thread 2
		ThreadsGenerator.threads[2].start.should.equal(203);
		ThreadsGenerator.threads[2].position.should.equal(203);
		ThreadsGenerator.threads[2].end.should.equal(303);
		ThreadsGenerator.threads[2].connection.should.equal('open');
		ThreadsGenerator.threads[2].header.should.equal('bytes=203-303');

		//Thread 3
		ThreadsGenerator.threads[3].start.should.equal(304);
		ThreadsGenerator.threads[3].position.should.equal(304);
		ThreadsGenerator.threads[3].end.should.equal(401);
		ThreadsGenerator.threads[3].connection.should.equal('open');
		ThreadsGenerator.threads[3].header.should.equal('bytes=304-401');

	});

});