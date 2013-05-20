var should = require('should');
var ThreadRecorder = require('../lib/core/ThreadRecorder');
var mockedRequires = require('./mock/mock.requires');

describe('Module: ThreadRecorder', function() {


	it('should be a function', function() {

		ThreadRecorder.should.be.a('function');
	});

	var properties = [
		'fullPath',
		'fileName',
		'filePath',
		'requires',
		'threads',
		'save'];

	it('should have properties - ' + properties.join(', '), function() {
		var threadRecorder = new ThreadRecorder({
			threads: {},

			requires: {
				os: mockedRequires.os,
				fs: mockedRequires.fs
			}
		});
		properties.forEach(function(p) {
			threadRecorder.should.have.property(p);
		});

	});

	it('save file', function() {
		var threadRecorder = new ThreadRecorder({
			threads: {},
			fileName: '',
			requires: {
				os: mockedRequires.os,
				fs: mockedRequires.fs
			}
		});
		threadRecorder.save('12345', 0);

	});



});