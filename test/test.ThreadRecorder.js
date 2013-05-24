var should = require('should');
var ThreadRecordWriter = require('../lib/core/ThreadRecordWriter');
var mockedRequires = require('./mock/mock.requires');

describe('Module: ThreadRecordWriter', function() {


	it('should be a function', function() {

		ThreadRecordWriter.should.be.a('function');
	});

	var properties = [
		'fullPath',
		'fileName',
		'filePath',
		'requires',
		'threads',
		'save'];

	it('should have properties - ' + properties.join(', '), function() {
		var threadRecordWriter = new ThreadRecordWriter({
			threads: {},

			requires: {
				os: mockedRequires.os,
				fs: mockedRequires.fs
			}
		});
		properties.forEach(function(p) {
			threadRecordWriter.should.have.property(p);
		});

	});

	it('save file', function() {
		var threadRecordWriter = new ThreadRecordWriter({
			threads: {},
			fileName: '',
			requires: {
				os: mockedRequires.os,
				fs: mockedRequires.fs
			}
		});
		threadRecordWriter.save('12345', 0);

	});



});