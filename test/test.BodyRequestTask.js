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
		var bodyRequestTask = new BodyRequestTask({
			url: 'http://hihi',
			header: 'bytes=0-100'
		});

		var bodyRequestMade = false;
		var response;

		bodyRequestTask.callback = function() {
			bodyRequestMade = true;
		};

		bodyRequestTask.onData = function(data) {
			response = data;
		};

		bodyRequestTask.execute();
		response.should.equal('random-data');
		bodyRequestMade.should.be.ok;
	});
});