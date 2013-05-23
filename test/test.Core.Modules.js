var should = require('should');
var modules = ['DownloadFileNameGenerator', 'Downloader', 'ThreadsGenerator', 'Analytics', 'ThreadRecorder', 'DownloadWriter','Checksum'];

describe('Modules', function() {
	modules.forEach(function(moduleName) {
		it('Module: ' + moduleName + ' should exist', function() {
			var module = require('../lib/core/' + moduleName);
			should.exist(module);
		});
	});
});