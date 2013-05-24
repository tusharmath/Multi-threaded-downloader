var should = require('should');
var ThreadRecordLoader = require('../lib/core/ThreadRecordLoader');
var MockedRequires = require('./mock/mock.requires');

describe('Module: ThreadRecordLoader', function() {

	it('should be a function', function() {
		ThreadRecordLoader.should.be.a('function');
	});

	describe('Methods:', function() {
		var methods = ['load', 'onLoad'];

		var threadRecordLoader = new ThreadRecordLoader({
			requires: {
				fs: MockedRequires.fs
			},
			path: ''
		});
		it('should have methods - ' + methods.join(', '), function() {
			methods.forEach(function(p) {
				threadRecordLoader.should.have.property(p);
				threadRecordLoader[p].should.be.a('function');
			});
		});
	});


	describe('Properties:', function() {
		var properties = ['path', 'requires', 'readOptions'];
		var threadRecordLoader = new ThreadRecordLoader({
			requires: {
				fs: MockedRequires.fs
			},
			path: ''
		});
		it('should have properties - ' + properties.join(', '), function() {
			properties.forEach(function(p) {
				threadRecordLoader.should.have.property(p);
			});
		});
	});


	describe('Working:', function() {
		it('should load', function() {
			var threadRecordLoader = new ThreadRecordLoader({
				requires: {
					fs: MockedRequires.fs
				},
				path: ''
			});
			var isLoaded;
			threadRecordLoader.onLoad = function(data) {
				isLoaded = data;
			};
			threadRecordLoader.load();
			isLoaded.should.be.a('object');
		});
	});
});