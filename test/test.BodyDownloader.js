	var should = require('should');
	var Factory = require('../lib/utils/Factory');
	Factory.register('BodyDownloader', 'mock');

	describe('Module: BodyDownloader', function() {

		describe('Methods:', function() {
			var methods = ['onData', 'onEnd', 'start', 'onStart', 'onError', 'stop'];

			var bodyDownloader = Factory.create('BodyDownloader');
			it('should have methods - ' + methods.join(', '), function() {
				methods.forEach(function(p) {
					bodyDownloader.should.have.property(p);
					bodyDownloader[p].should.be.a('function');
				});
			});
		});


		describe('Properties:', function() {
			var properties = ['url', 'header', 'threadIndex', 'requires'];
			var bodyDownloader = Factory.create('BodyDownloader');
			it('should have properties - ' + properties.join(', '), function() {
				properties.forEach(function(p) {
					bodyDownloader.should.have.property(p);
				});
			});
		});


		describe('Working:', function() {
			var bodyDownloader = Factory.create('BodyDownloader');
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