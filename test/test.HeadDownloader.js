var should = require('should');
var Downloader = require('../lib/core/HeadDownloader');
var Mocked = require('./mock/mock.requires');


describe('Module: Downloader', function() {


	describe('Methods:', function() {
		var methods = ['onEnd', 'start', 'onError'];
		it('should have methods - ' + methods.join(', '), function() {
			it('should be a function', function() {
				Downloader.should.be.a('function');
			});


			var downloader = new Downloader({
				url: '',

				requires: {
					http: Mocked.http,
					url: Mocked.url
				}

			});

			methods.forEach(function(p) {
				downloader.should.have.property(p);
				downloader[p].should.be.a('function');
			});
		});
	});


	describe('Properties:', function() {
		var properties = ['requires', 'url'];
		it('should have properties - ' + properties.join(', '), function() {

			var downloader = new Downloader({

				requires: {
					http: Mocked.http,
					url: Mocked.url
				},
				url: 'http://www.wikistuce.info/lib/exe/fetch.php/javascript/colredim.htm'
			});


			properties.forEach(function(p) {
				downloader.should.have.property(p);
			});
		});
	});


	describe('Working:', function() {

		it('should start download', function() {

			var downloader = new Downloader({

				requires: {
					http: Mocked.http,
					url: Mocked.url
				},
				url: 'http://www.wikistuce.info/lib/exe/fetch.php/javascript/colredim.htm'
			});
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