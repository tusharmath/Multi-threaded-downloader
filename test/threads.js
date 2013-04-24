var ndthreads = require('../lib/core/ndThreads');

var options = {
	threadCount: 5,
	fileSize: 100,
	inc: true

};

var threader = new ndthreads(options);

exports.createThreads_inc = function(test) {
	test.expect(11);

	var threads = threader.createThreads();

	var status = threads.getStatus();

	test.equal(status.length, 5);

	test.equal(status[0].start, 0);
	test.equal(status[0].end, 7);

	test.equal(status[1].start, 8);
	test.equal(status[1].end, 14);

	test.equal(status[2].start, 15);
	test.equal(status[2].end, 28);

	test.equal(status[3].start, 29);
	test.equal(status[3].end, 56);


	test.equal(status[4].start, 57);
	test.equal(status[4].end, 100);

	test.done();
};