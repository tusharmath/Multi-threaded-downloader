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

        var onResponse = function(err, response) {
            _response = response;
        };

        var bodyRequestTask = new BodyRequestTask('http://hihi.com/qwerty', 100, 200, onResponse, options);

        var callback = function(err, response) {
            dataResponse = response;
            dataResponse.connection.should.equal('open');
            dataResponse.data.should.equal(mockery.Fake_HttpBodyResponse.content);
        };

        bodyRequestTask.method.should.equal('POST');
        bodyRequestTask.port.should.equal('1111');
        bodyRequestTask.execute(callback);

        bodyRequestTask.connection.should.equal('closed');
        _response['is-fake'].should.be.ok;
        done();
    });
});