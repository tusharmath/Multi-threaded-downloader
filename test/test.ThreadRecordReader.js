var should = require('should');
var ThreadRecordReader = require('../lib/core/ThreadRecordReader');
var MockedRequires = require('./mock/mock.requires');

describe('Module: ThreadRecordReader', function() {

	it('should be a function', function() {
		ThreadRecordReader.should.be.a('function');
	});

	describe('Methods:', function() {
		var methods = ['load', 'onLoad', 'remove'];

		var threadRecordReader = new ThreadRecordReader({
			requires: {
				fs: MockedRequires.fs
			},
			path: ''
		});
		it('should have methods - ' + methods.join(', '), function() {
			methods.forEach(function(p) {
				threadRecordReader.should.have.property(p);
				threadRecordReader[p].should.be.a('function');
			});
		});
	});


	describe('Properties:', function() {
		var properties = ['path', 'requires', 'readOptions'];
		var threadRecordReader = new ThreadRecordReader({
			requires: {
				fs: MockedRequires.fs
			},
			path: ''
		});
		it('should have properties - ' + properties.join(', '), function() {
			properties.forEach(function(p) {
				threadRecordReader.should.have.property(p);
			});
		});
	});


	describe('Working:', function() {
		it('should load', function() {
			var threadRecordReader = new ThreadRecordReader({
				requires: {
					fs: MockedRequires.fs
				},
				path: ''
			});
			var isLoaded;
			threadRecordReader.onLoad = function(data) {
				isLoaded = data;
			};
			threadRecordReader.load();
			isLoaded.should.be.a('object');
		});

		it('should remove', function() {
			var threadRecordReader = new ThreadRecordReader({
				requires: {
					fs: MockedRequires.fs
				},
				path: ''
			});
			var isDeleted = false;
			threadRecordReader.onRemove = function(data) {
				isDeleted = true;
			};
			threadRecordReader.remove();
			isDeleted.should.be.ok;
		});
	});
});