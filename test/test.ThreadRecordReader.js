var should = require('should');

var Factory = require('../lib/utils/Factory');
Factory.register('ThreadRecordReader', 'mock');


describe('Module: ThreadRecordReader', function() {


	describe('Methods:', function() {
		var methods = ['load', 'onLoad', 'remove'];

		var threadRecordReader = Factory.create('ThreadRecordReader');
		it('should have methods - ' + methods.join(', '), function() {
			methods.forEach(function(p) {
				threadRecordReader.should.have.property(p);
				threadRecordReader[p].should.be.a('function');
			});
		});
	});


	describe('Properties:', function() {
		var properties = ['path', 'requires', 'readOptions'];
		var threadRecordReader = Factory.create('ThreadRecordReader');
		it('should have properties - ' + properties.join(', '), function() {
			properties.forEach(function(p) {
				threadRecordReader.should.have.property(p);
			});
		});
	});


	describe('Working:', function() {
		it('should load', function() {
			var threadRecordReader = Factory.create('ThreadRecordReader');
			var isLoaded;
			threadRecordReader.onLoad = function(data) {
				isLoaded = data;
			};
			threadRecordReader.path = '';
			threadRecordReader.load();
			isLoaded.should.be.a('object');
		});

		it('should remove', function() {
			var threadRecordReader = Factory.create('ThreadRecordReader');
			var isDeleted = false;
			threadRecordReader.onRemove = function(data) {
				isDeleted = true;
			};
			threadRecordReader.remove();
			isDeleted.should.be.ok;
		});
	});
});