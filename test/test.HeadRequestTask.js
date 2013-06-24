var mockery = require('./mock/mock.requires');
var should = require('should');

var HeadRequestTask;
describe('HeadRequestTask', function() {
	before(function() {
		mockery.enable({
			useCleanCache: true
		});

		HeadRequestTask = require('../lib/core/HeadRequestTask');
	});

	after(function() {
		mockery.disable();
	});

	it('test execute method', function() {
		var headRequestTask = new HeadRequestTask('http://random/dom');

		var headRequestMade = false;

		headRequestTask.callback = function(data) {
			headRequestMade = true;
		};

		headRequestTask.execute();
		headRequestMade.should.be.ok;
	});
});