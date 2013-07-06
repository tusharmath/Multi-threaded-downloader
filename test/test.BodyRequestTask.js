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

	it('test execute method', function() {
		var dataResponse, bodyRequestMade = false,
			response;

		var options = {
			method: 'POST',
			port: '1111'
		};

		var onData = function(data) {
			dataResponse = data;
		};

		var bodyRequestTask = new BodyRequestTask('http://hihi.com/qwerty', 100, 200, onData, options);



		bodyRequestTask.callback = function(resp) {
			bodyRequestMade = true;
			response = resp;

		};


		bodyRequestTask.execute();
		dataResponse.should.equal('random-data');
		response.method.should.equal('POST');
		response.port.should.equal('1111');
		bodyRequestMade.should.be.ok;

	});
});