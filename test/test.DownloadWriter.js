var should = require('should');
var Factory = require('../lib/utils/Factory');
Factory.register('DownloadWriter', 'mock');

var MockRequires = require('./mock/mock.requires');

describe('Module: DownloadWriter', function() {

	describe('Methods:', function() {
		var methods = ['write', 'onWrite'];

		var downloadWriter = Factory.create('DownloadWriter');

		it('should have methods - ' + methods.join(', '), function() {
			methods.forEach(function(p) {
				downloadWriter.should.have.property(p);
				downloadWriter[p].should.be.a('function');
			});
		});
	});


	describe('Properties:', function() {
		var properties = ['requires'];
		var downloadWriter = Factory.create('DownloadWriter');

		it('should have properties - ' + properties.join(', '), function() {
			properties.forEach(function(p) {
				downloadWriter.should.have.property(p);
			});
		});
	});


	describe('Working:', function() {
		var downloadWriter = Factory.create('DownloadWriter');
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