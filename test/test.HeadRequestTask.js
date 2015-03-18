var mockery = require('./mock/mock.requires');
var sinon = require('sinon');
var should = require('should');
var e = require('../lib/Exceptions');

var HeadRequestTask;
describe('HeadRequestTask', function () {
	before(function () {
		mockery.enable({
			warnOnUnregistered: false
		});

		HeadRequestTask = require('../lib/core/HeadRequestAsyncTask');
	});

	after(function () {
		mockery.disable();
	});

	afterEach(function () {
		mockery.resetCache();
	});

	it('test execute method', function (done) {

		var req = new HeadRequestTask('http://random/dom');

		var callback = function (err, data) {
			if (data) {
				data.fileSize.should.equal(100);
				data.headers.should.equal(mockery.Fake_HttpBodyResponse.headers);
				done();
			}

		};
		req.execute(callback);

	});

	it('test onerror method', function (done) {

		var req = new HeadRequestTask('http://random/dom');

		var callback = function (err, data) {
			if (err) {
				err.should.eql(e(1004, 'random'));
				done();
			}

		};
		req.execute(callback);

	});
	describe('custom headers', function () {
		var http;
		beforeEach(function () {
			http = require('http')
			sinon.stub(http, 'request')
				.returns({
					on: sinon.stub()
						.returns({
							end: sinon.stub()
						})
				});
		});
		afterEach(function () {
			http.request.restore();
		});
		it('requests with custom headers', function () {
			var requestHeader = {};
			var req = new HeadRequestTask('http://random/dom', {
				headers: requestHeader
			});

			req.execute(function () {});
			http.request.callCount.should.equal(1);
			http.request.getCall(0)
				.args[0].headers.should.equal(requestHeader);
		});
	});
});