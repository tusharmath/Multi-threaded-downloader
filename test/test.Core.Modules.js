var should = require('should');
var modules = ['DownloadFileNameGenerator', 'Downloader'];

describe('Modules', function() {
	modules.forEach(function(moduleName) {
		it(moduleName + ' should exist', function() {
			var module = require('../lib/core/' + moduleName);
			should.exist(module);
		});
	});
});