var mockery = require('./mock/mock.requires');
var should = require('should');
var sinon = require('sinon');

var BodyRequestTask;
describe('BodyRequestTask', function () {
	before(function () {
		mockery.enable({
			warnOnUnregistered: false
		});

		BodyRequestTask = require('../lib/core/BodyRequestAsyncTask');
	});

	after(function () {
		mockery.disable();
	});

	afterEach(function () {
		mockery.resetCache();
	});

	it('test execute method', function (done) {
		var dataResponse, bodyRequestMade = false,
			_response;

		var options = {
			method: 'POST',
			port: '1111'
		};
		var bodyRequestTask = new BodyRequestTask('http://hihi.com/qwerty', 100, 200, options);

		var callback = function (err, response) {
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

	it('test completed threads', function (done) {
		var bodyRequestTask = new BodyRequestTask('http://hihi.com/qwerty', 100, 100);

		var callback = function (err, response) {

			response.event.should.equal('end');
			done();
		};

		bodyRequestTask.execute(callback);

	});

	it('test onError method', function (done) {
		var dataResponse, bodyRequestMade = false,
			_response;

		var bodyRequestTask = new BodyRequestTask('http://hihi.com/qwerty', 100, 200);

		var callback = function (err, response) {
			if (err) {
				err.should.equal('fake-error');
				done();
			}
		};

		bodyRequestTask.execute(callback);

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

		it('test bodyrequest with headers', function () {
			var requestHeader = {
				cookie: 'key-name=key-value;',
				range: 'bytes=10-20',
				other: 'marry had a little lamp'
			};

			var bodyRequestTask = new BodyRequestTask('http://hihi.com/qwerty', 100, 200, {
				headers: requestHeader
			});

			bodyRequestTask.execute(sinon.spy());
			http.request.callCount.should.equal(1);
			var headers = http.request.getCall(0)
				.args[0].headers;

			headers.should.equal(requestHeader);
			headers.range.should.equal('bytes=100-200');
		});
	});

});