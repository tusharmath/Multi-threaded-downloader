var should = require('should');
describe('Modules', function() {
	it('DownloadFileNameGenerator should exist', function() {
		var generator = require('../lib/core/DownloadFileNameGenerator');
		should.exist(generator);
	});
});