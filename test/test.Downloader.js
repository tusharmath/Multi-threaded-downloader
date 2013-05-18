var should = require('should');
var Downloader = require('../lib/core/Downloader');

describe('Downloader class', function() {

	it('should be a function', function() {
		Downloader.should.be.a('function');
	});

	it('should return proper name', function() {

		var downloader = new Downloader({});
		downloader.should.have.property('onPacketReceived');
		downloader.should.have.property('onDownloadStart');
		downloader.should.have.property('onDownloadComplete');
		downloader.should.have.property('setRequires');
		downloader.should.have.property('start');
	});
});