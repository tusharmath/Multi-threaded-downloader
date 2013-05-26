	var should = require('should');
	var BodyDownloader = require('../lib/core/BodyDownloader');
	var Mocked = require('./mock/mock.requires');

	describe('Module: BodyDownloader', function() {

		it('should be a function', function() {
			BodyDownloader.should.be.a('function');
		});

		describe('Methods:', function() {
			var methods = ['onData', 'onEnd', 'start', 'onStart', 'onError', 'stop'];

			var bodyDownloader = new BodyDownloader({
				url: '',
				header: '',
				threadIndex: 0,
				requires: {
					http: Mocked.http,
					url: Mocked.url
				}
			});
			it('should have methods - ' + methods.join(', '), function() {
				methods.forEach(function(p) {
					bodyDownloader.should.have.property(p);
					bodyDownloader[p].should.be.a('function');
				});
			});
		});


		describe('Properties:', function() {
			var properties = ['url', 'header', 'threadIndex', 'requires'];
			var bodyDownloader = new BodyDownloader({
				url: '',
				header: '',
				threadIndex: 0,
				requires: {
					http: Mocked.http,
					url: Mocked.url
				}
			});
			it('should have properties - ' + properties.join(', '), function() {
				properties.forEach(function(p) {
					bodyDownloader.should.have.property(p);
				});
			});
		});


		describe('Working:', function() {
			var bodyDownloader = new BodyDownloader({
				url: '',
				header: '',
				threadIndex: 0,
				requires: {
					http: Mocked.http,
					url: Mocked.url
				}
			});
			it('should start downloading body', function() {
				var _data = [];
				var _ended = false;
				var _started = false;
				var _index;

				bodyDownloader.onData = function(data, index) {

					_data = data;
					_index = index;
				};

				bodyDownloader.onEnd = function() {
					_ended = true;
				};
				bodyDownloader.onStart = function() {
					_started = true;
				};

				bodyDownloader.start();

				bodyDownloader.should.have.property('response');
				_data.should.have.lengthOf(10);
				_index.should.equal(0);
				_ended.should.be.ok;
				_started.should.be.ok;
			});

			it('should stop downloading body', function() {
				var _ended = false;

				var _index;


				bodyDownloader.onEnd = function(index) {
					_ended = true;
					_index = 0;
				};

				bodyDownloader.start();
				bodyDownloader.stop();

				_index.should.equal(0);
				_ended.should.be.ok;

			});

		});
	});