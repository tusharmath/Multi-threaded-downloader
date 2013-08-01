var should = require('should');
var u = require('../lib/Utils');
var _ = require('underscore');
var fake = function() {};

var DownloadValidator = require('../lib/core/DownloadValidator');
describe('DownloadValidator', function() {

	it('test successful download', function(done) {
		var threads = [{
			position: 10,
			end: 10
		}, {
			position: 21,
			end: 20
		}];

		u.executor(DownloadValidator, threads)(function(err, result) {
			result.should.be.ok;
			should.not.exist(err);
			done();
		});
	});


it('test incomplete download', function(done) {
		var threads = [{
			position: 8,
			end: 10
		}, {
			position: 21,
			end: 20
		}];

		u.executor(DownloadValidator, threads)(function(err, result) {
			result.should.be.ok;
			should.not.exist(err);
			done();
		});
	});


});