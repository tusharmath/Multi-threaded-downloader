var should = require('should');
var modules = [
	'ThreadRecordReader',
	'DownloadFileNameGenerator',
	'HeadDownloader',
	'ThreadsGenerator',
	'Analytics',
	'ThreadRecordWriter',
	'DownloadWriter',
	'Checksum',
	'BodyDownloader'];

describe('Modules',

function() {
	modules.forEach(function(moduleName) {
		it('Module: ' + moduleName + ' should exist', function() {
			var module = require('../lib/core/' + moduleName);
			should.exist(module);
		});
	});
});