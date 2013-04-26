var ndthreads = require('../lib/core/ndThreads');

exports.createThreads = function(test) {

	var options = {
		threadCount: 5,
		fileSize: 100

	};
	var threader = new ndthreads(options);

	test.expect(11);

	var threads = threader.createThreads();

	var status = threads.getStatus();

	test.equal(status.length, 5);

	test.equal(status[0].start, 0);
	test.equal(status[0].end, 20);

	test.equal(status[1].start, 21);
	test.equal(status[1].end, 40);

	test.equal(status[2].start, 41);
	test.equal(status[2].end, 60);

	test.equal(status[3].start, 61);
	test.equal(status[3].end, 80);


	test.equal(status[4].start, 81);
	test.equal(status[4].end, 100);

	test.done();
};