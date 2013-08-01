var should = require('should');
var _ = require('underscore');
var fake = function() {};

var DataRequest = require('../lib/core/DataRequestTask');
describe('DataRequest', function() {

	it('test write data', function(done) {
		var size = 100;
		var outputFile = [];

		var writer = function(data, position, callback) {

			_.times(data.length, function(n) {
				outputFile[position + n] = outputFile[position + n] === undefined ? 1 : outputFile[position + n] + 1;
			});
		};

		var dataBuilder = function(length) {
			return {
				event: 'data',
				data: {
					length: length
				}
			};
		};

		var endBuilder = function(item) {
			return {
				event: 'end'
			};
		};
		var c1, c2;

		var metaBuilder = function(callback) {
			callback(null, {
				data: {
					length: 20
				},
				position: 120

			});
		};

		var bodyResponse = function(callback) {
			if (c1) {
				c2 = callback;

				//Random C1 and C2
				c1(null, dataBuilder(10));

				c2(null, dataBuilder(10));
				c2(null, dataBuilder(10));

				c1(null, dataBuilder(10));
				c1(null, dataBuilder(10));
				c1(null, dataBuilder(10));

				c2(null, dataBuilder(10));
				c2(null, dataBuilder(10));
				c2(null, dataBuilder(10));

				c2(null, {
					event: 'end'
				});


				c1(null, dataBuilder(10));


				//END
				c1(null, {
					event: 'end'
				});
			} else {
				c1 = callback;
			}
		};

		var threadUpdator = function(item, err, response, destroy, callback) {
			if (response.event == 'data') {
				item.position += response.data.length;
			} else if (response.event == 'end') {
				callback();
			}
		};


		var threads = [{
			position: 0,
			bodyRequest: bodyResponse
		}, {
			position: 50,
			bodyRequest: bodyResponse
		}];


		var req = new DataRequest(writer, threads, metaBuilder, fake, threadUpdator, fake, {});

		var callback = function(err, result) {
			//console.log(outputFile);
			var dataFile = outputFile.slice(0, 100);
			var metaFile = outputFile.slice(120, 140);

			_.each(dataFile, function(item) {
				item.should.equal(1);
			});


			_.each(metaFile, function(item) {
				item.should.equal(10);
			});

			outputFile.length.should.equal(140);

			done();
		};

		req.execute(callback);

	});

	it('test http error', function(done) {


		var bodyRequest = function(callback) {
			callback('http-error');
		};

		var destroy = function() {
			done();
		};

		var threads = [{
			bodyRequest: bodyRequest,
			connection: 'open',
			destroy: destroy
		}];

		var threadUpdator = function(item, err, response, destroy, callback) {
			item.connection = 'failed';
			item.destroy();
			callback();
		};


		var req = new DataRequest(fake, threads, fake, fake, threadUpdator, fake, {});

		var callback = function(err, result) {
			should.not.exist(err);
			threads[0].connection.should.equal('failed');
		};
		req.execute(callback);

	});


	it('test timeout error', function(done) {

		var destroyedCalled = false;

		var threadsDestroyer = function() {
			destroyedCalled = true;
		};

		var threads = [];

		var timer = function(cmd, callback) {
			callback('timeout-err');
		};


		var req = new DataRequest(fake, threads, fake, timer, fake, threadsDestroyer, {});

		var callback = function(err, result) {
			err.should.equal('timeout-err');
			destroyedCalled.should.be.ok;
			req.destroyed.should.be.ok;
			done();
		};
		req.execute(callback);

	});

	it('test abrupt end', function(done) {


		var bodyRequest = function(callback) {
			callback(null, {
				event: 'end'
			});
		};

		var threads = [{
			bodyRequest: bodyRequest,
			connection: 'open'
		}];

		var threadUpdator = function(item, err, response, destroy, callback) {
			item.connection = 'failed';
			callback();
		};


		var req = new DataRequest(fake, threads, fake, fake, threadUpdator, fake, {});

		var callback = function(err, result) {
			should.not.exist(err);
			threads[0].connection.should.equal('failed');
			done();
		};
		req.execute(callback);

	});

});