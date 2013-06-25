var mockery = require('./mock/mock.requires');
var should = require('should');

var HeadRequestTask;
describe('HeadRequestTask', function() {
	before(function() {
		mockery.enable({
			warnOnUnregistered: false
		});

		HeadRequestTask = require('../lib/core/HeadRequestAsyncTask');
	});

	after(function() {
		mockery.disable();
	});

	it('test execute method', function() {
		var headRequestTask = new HeadRequestTask('http://random/dom');

		var headRequestMade = false;
		var response;

		headRequestTask.callback = function(data) {
			headRequestMade = true;
			response = data;
		};

		headRequestTask.execute();
		headRequestMade.should.be.ok;
		response.fileSize.should.equal(100);
		response.contentType.should.equal('text/html');

	});
});