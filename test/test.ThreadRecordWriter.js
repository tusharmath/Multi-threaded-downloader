var should = require('should');
var Factory = require('../lib/utils/Factory');
Factory.register({
	ThreadRecordWriter: {
		useMocked: true,
		requires: 'fs os'
	}
});

describe('Module: ThreadRecordWriter', function() {


	var properties = [
		'fullPath',
		'fileName',
		'filePath',
		'requires',
		'threads',
		'save'];

	it('should have properties - ' + properties.join(', '), function() {
		var threadRecordWriter = Factory.create('ThreadRecordWriter');
		properties.forEach(function(p) {
			threadRecordWriter.should.have.property(p);
		});

	});

	it('save file', function() {
		var threadRecordWriter = Factory.create('ThreadRecordWriter');
		threadRecordWriter.save('12345', 0);

	});



});