var ndthreads = require('../lib/core/ndThreads');

exports.createThreads = function(test) {

	var options = {
		fileSize: 400
	};
	var threader = new ndthreads(options);

	test.expect(9);

	var threads = threader.createThreads();

	var status = [{
		start: 0,
		end: 100
	}, {
		start: 101,
		end: 200
	}, {
		start: 201,
		end: 300
	}, {
		start: 301,
		end: 400
	}];
	threads.finish();

	test.equal(status.length, 4);
	for (var i = 0; i < 4; i++) {
		var t = threads.getStatus(i);
		test.equal(t.start, status[i].start);
		test.equal(t.end, status[i].end);
	}

	test.done();
};