var ndthreads = require('../lib/core/ndThreads');

var options = {
	threadCount: 5,
	fileSize: 100,
	increasing: true

};

var threader = new ndthreads(options);

exports.createThreads_inc = function(test) {
	test.expect(11);

	var threads = threader.createThreads();

	var status = threads.getStatus();

	test.equal(status.length, 5);

	test.equal(status[0].start, 50);
	test.equal(status[0].end, 100);

	test.equal(status[1].start, 25);
	test.equal(status[1].end, 49);

	test.equal(status[2].start, 12);
	test.equal(status[2].end, 24);

	test.equal(status[3].start, 6);
	test.equal(status[3].end, 11);


	test.equal(status[4].start, 0);
	test.equal(status[4].end, 5);

	test.done();
};