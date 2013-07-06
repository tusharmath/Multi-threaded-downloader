var should = require('should');
var ThreadsGenerator = require('../lib/core/ThreadsGeneratorSyncTask');

describe('ThreadGeneratorTask', function() {
	it('test excution method ', function(done) {
		var generator = new ThreadsGenerator(100, 4, '0-100');

		generator.callback = function(err, threads) {

			threads[0].start.should.equal(0);
			threads[0].end.should.equal(25);

			threads[1].start.should.equal(26);
			threads[1].end.should.equal(50);

			threads[2].start.should.equal(51);
			threads[2].end.should.equal(75);

			threads[3].start.should.equal(76);
			threads[3].end.should.equal(100);
			done();
		};
		generator.execute();

	});

	it('test range download', function(done) {
		var generator = new ThreadsGenerator(100, 2, '50-60');

		generator.callback = function(err, threads) {

			threads[0].start.should.equal(50);
			threads[0].end.should.equal(55);

			threads[1].start.should.equal(56);
			threads[1].end.should.equal(60);
			done();
		};
		generator.execute();

	});
});