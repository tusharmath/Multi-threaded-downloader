var should = require('should');
var ThreadRecorder = require('../lib/core/ThreadRecorder');

describe('Module: ThreadRecorder', function() {


	it('should be a function', function() {

		ThreadRecorder.should.be.a('function');
	});



	var properties = ['threads', 'fileName', 'filePath', 'requires', 'save'];

	it('should have properties - ' + properties.join(', '), function() {
		var threadRecorder = new ThreadRecorder({
			threads: {},
			fileName: '',
			requires: {
				os: require('os'),
				fs: require('fs')
			}
		});
		properties.forEach(function(p) {
			threadRecorder.should.have.property(p);
		});

	});



});