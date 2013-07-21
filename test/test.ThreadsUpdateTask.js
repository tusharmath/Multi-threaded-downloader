var should = require('should');

ThreadUpdator = require('../lib/core/ThreadUpdateTask');

var DownloadReader;


describe('ThreadUpdateTask', function() {
	var open = 'open';
	var closed = 'closed';
	var failed = 'failed';
	var idle = 'idle';


	it('test execute method', function() {
		var threadUpdater = new ThreadUpdator();

		var thread = {
			connection: idle
		};
		threadUpdater.execute(thread, null, {});
		thread.connection.should.equal(idle);

		thread = {
			connection: idle
		};
		threadUpdater.execute(thread, null, {
			event: 'response'
		});
		thread.connection.should.equal(open);

		thread = {
			connection: open
		};
		threadUpdater.execute(thread, {});
		thread.connection.should.equal(failed);

		thread = {
			connection: open,
			position: 10
		};

		threadUpdater.execute(thread, null, {
			event: 'data',
			data: 'AAAA'
		});

		thread.position.should.equal(14);

		var shouldEnd = false;
		thread = {
			connection: open,
			position: 5,
			end: 10
		};
		threadUpdater.execute(thread, null, {
			event: 'end'
		}, null, function() {
			shouldEnd = true;
		});
		thread.connection.should.equal(failed);
		shouldEnd.should.be.ok;


		thread = {
			position: 11,
			end: 10,
			connection: open
		};
		threadUpdater.execute(thread, null, {
			event: 'end'
		}, null, function() {});
		thread.connection.should.equal(closed);



		var destroyed;
		thread = {
			connection: open

		};
		threadUpdater.execute(thread, null, {
			event: 'response',

			destroy: function() {
				destroyed = true;
			}

		}, true);
		destroyed.should.be.ok;



	});
});