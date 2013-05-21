var should = require('should');
var DownloadWriter = require('../lib/core/DownloadWriter');
var MockRequires = require('./mock/mock.requires');

describe('Module: DownloadWriter', function() {

	it('should be a function', function() {
		DownloadWriter.should.be.a('function');
	});

	describe('Methods:', function() {
		var methods = ['write', 'onWrite'];

		var downloadWriter = new DownloadWriter({
			requires: {
				fs: MockRequires.fs
			}
		});
		it('should have methods - ' + methods.join(', '), function() {
			methods.forEach(function(p) {
				downloadWriter.should.have.property(p);
				downloadWriter[p].should.be.a('function');
			});
		});
	});


	describe('Properties:', function() {
		var properties = ['requires'];
		var downloadWriter = new DownloadWriter({
			requires: {
				fs: MockRequires.fs
			}
		});
		it('should have properties - ' + properties.join(', '), function() {
			properties.forEach(function(p) {
				downloadWriter.should.have.property(p);
			});
		});
	});


	describe('Working:', function() {
		var downloadWriter = new DownloadWriter({
			requires: {
				fs: MockRequires.fs
			}
		});
		var written = false;
		downloadWriter.onWrite = function() {
			written = true;
		};

		downloadWriter.write([]);

		it('should call the callback', function() {
			written.should.be.ok;
		});
	});
});