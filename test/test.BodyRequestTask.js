var mockery = require('./mock/mock.requires');
var should = require('should');

var BodyRequestTask;
describe('BodyRequestTask', function() {
	before(function() {
		mockery.enable({
			warnOnUnregistered: false
		});

		BodyRequestTask = require('../lib/core/BodyRequestAsyncTask');
	});

	after(function() {
		mockery.disable();
	});

	it('test execute method', function(done) {
		var dataResponse, bodyRequestMade = false,
			_response;

		var options = {
			method: 'POST',
			port: '1111'
		};
		var bodyRequestTask = new BodyRequestTask('http://hihi.com/qwerty', 100, 200, options);

		var callback = function(err, response) {
			if (response) {
				dataResponse = response;
				if (dataResponse.event == 'data') {
					dataResponse.data.should.equal(mockery.Fake_HttpBodyResponse.content);
					bodyRequestTask.method.should.equal('POST');
					bodyRequestTask.port.should.equal('1111');
					done();
				}
			}
		};

		bodyRequestTask.execute(callback);

	});

	it('test completed threads', function(done) {
		var bodyRequestTask = new BodyRequestTask('http://hihi.com/qwerty', 100, 100);

		var callback = function(err, response) {

			response.event.should.equal('end');
			done();
		};


		bodyRequestTask.execute(callback);

	});

	it('test onError method', function(done) {
		var dataResponse, bodyRequestMade = false,
			_response;

		var bodyRequestTask = new BodyRequestTask('http://hihi.com/qwerty', 100, 200);

		var callback = function(err, response) {
			if (err) {
				err.should.equal('fake-error');
				done();
			}
		};

		bodyRequestTask.execute(callback);

	});
});