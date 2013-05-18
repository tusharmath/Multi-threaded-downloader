var should = require('should');
var modules = ['DownloadFileNameGenerator', 'Downloader', 'ThreadsGenerator'];

describe('Modules', function() {
	modules.forEach(function(moduleName) {
		it(moduleName + ' should exist', function() {
			var module = require('../lib/core/' + moduleName);
			should.exist(module);
		});
	});
});