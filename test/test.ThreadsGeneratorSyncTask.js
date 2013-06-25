var should = require('should');
var ThreadsGenerator = require('../lib/core/ThreadsGeneratorSyncTask');

describe('ThreadGeneratorTask', function() {
	it('test creation task', function() {
		var threads = new ThreadsGenerator(100, {
			count: 4
		});
		threads[0].start.should.equal(0);
		threads[0].end.should.equal(25);
		threads[1].start.should.equal(26);
		threads[1].end.should.equal(50);
		threads[2].start.should.equal(51);
		threads[2].end.should.equal(75);
		threads[3].start.should.equal(76);
		threads[3].end.should.equal(100);

	});
});