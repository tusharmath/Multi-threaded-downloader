var should = require('should');
var ThreadsGenerator = require('../lib/core/ThreadsGeneratorSyncTask');

describe('ThreadGeneratorTask', function() {
	it('test creation task', function() {
		var generator = new ThreadsGenerator(100, {
			count: 4
		});
		var _threads = [];
		generator.callback = function(threads) {
			_threads = threads;
		};
		generator.execute();
		_threads[0].start.should.equal(0);
		_threads[0].end.should.equal(25);
		_threads[1].start.should.equal(26);
		_threads[1].end.should.equal(50);
		_threads[2].start.should.equal(51);
		_threads[2].end.should.equal(75);
		_threads[3].start.should.equal(76);
		_threads[3].end.should.equal(100);

	});
});