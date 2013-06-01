var should = require('should');
var Factory = require('../lib/utils/Factory');
Factory.register('HeadDownloader', 'mock');

describe('Module: HeadDownloader', function() {


	describe('Methods:', function() {
		var methods = ['onEnd', 'start', 'onError'];
		it('should have methods - ' + methods.join(', '), function() {


			var downloader = Factory.create('HeadDownloader');
			methods.forEach(function(p) {
				downloader.should.have.property(p);
				downloader[p].should.be.a('function');
			});
		});
	});


	describe('Properties:', function() {
		var properties = ['requires', 'url'];
		it('should have properties - ' + properties.join(', '), function() {

			var downloader = Factory.create('HeadDownloader');

			properties.forEach(function(p) {
				downloader.should.have.property(p);
			});
		});
	});


	describe('Working:', function() {

		it('should start download', function() {

			var downloader = Factory.create('HeadDownloader');

			var onStartResponse;
			downloader.onStart = function(response) {
				onStartResponse = response;
			};
			downloader.start();
			onStartResponse.should.have.property('fileSize');
			onStartResponse.fileSize.should.equal(100);

			onStartResponse.should.have.property('contentType');
			onStartResponse.contentType.should.equal('text/html');

		});
	});
});