var should = require('should');
var Downloader = require('../lib/core/Downloader');
var ThreadsGenerator = require('../lib/core/ThreadsGenerator');
var Mocked = require('./mock/mock.requires');


describe('Module: Downloader', function() {


	describe('Methods:', function() {
		var methods = ['onData', 'onEnd', 'start'];
		it('should have methods - ' + methods.join(', '), function() {
			ThreadsGenerator.destroy = true;
			ThreadsGenerator.create();
			it('should be a function', function() {
				Downloader.should.be.a('function');
			});


			var downloader = new Downloader({
				path: '',
				threads: ThreadsGenerator.threads,
				requires: {
					http: Mocked.http
				}

			});

			methods.forEach(function(p) {
				downloader.should.have.property(p);
				downloader[p].should.be.a('function');
			});
		});
	});


	describe('Properties:', function() {
		var properties = ['requires', 'url', 'threads'];
		it('should have properties - ' + properties.join(', '), function() {
			ThreadsGenerator.destroy = true;
			ThreadsGenerator.create();

			var downloader = new Downloader({
				threads: ThreadsGenerator.threads,
				requires: {
					http: Mocked.http
				},
				url: 'http://www.wikistuce.info/lib/exe/fetch.php/javascript/colredim.htm'
			});


			properties.forEach(function(p) {
				downloader.should.have.property(p);
			});
		});
	});


	describe('Working:', function() {


	});
});