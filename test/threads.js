var ndthreads = require('../lib/core/ndThreads');



exports.createThreads_inc_lin = function(test) {

	var options = {
		threadCount: 5,
		fileSize: 100,
		type: 'lin'

	};
	var threader = new ndthreads(options);

	test.expect(11);

	var threads = threader.createThreads();

	var status = threads.getStatus();

	test.equal(status.length, 5);

	test.equal(status[4].start, 57);
	test.equal(status[4].end, 100);

	test.equal(status[3].start, 29);
	test.equal(status[3].end, 56);

	test.equal(status[2].start, 15);
	test.equal(status[2].end, 28);

	test.equal(status[1].start, 8);
	test.equal(status[1].end, 14);


	test.equal(status[0].start, 0);
	test.equal(status[0].end, 7);

	test.done();
};

exports.createThreads_inc_fib = function(test) {

	var options = {
		threadCount: 5,
		fileSize: 100,
		type: 'fib'

	};
	var threader = new ndthreads(options);

	test.expect(11);

	var threads = threader.createThreads();

	var status = threads.getStatus();

	test.equal(status.length, 5);

	test.equal(status[4].start, 50);
	test.equal(status[4].end, 100);

	test.equal(status[3].start, 25);
	test.equal(status[3].end, 49);

	test.equal(status[2].start, 12);
	test.equal(status[2].end, 24);

	test.equal(status[1].start, 6);
	test.equal(status[1].end, 11);


	test.equal(status[0].start, 0);
	test.equal(status[0].end, 5);

	test.done();
};


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