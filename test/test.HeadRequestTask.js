var mockery = require('./mock/mock.requires');
var should = require('should');
var HeadRequestTask = require('../lib/core/HeadRequestTask');

suite('HeadRequestTask', function() {
	setup(function() {
		mockery.enable();
	});

	test(function() {
		var headRequestTask = new HeadRequestTask('http://random/dom');
		var headRequestMade = false;
		headRequestTask.callback = function() {
			headRequestMade = true;
		};
		headRequestMade.should.be.ok;
	});
});