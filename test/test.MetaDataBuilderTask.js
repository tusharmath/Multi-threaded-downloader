var should = require('should');
var DataBuilder = require('../lib/core/MetaDataBuilderSyncTask');

describe('MetaDataBuilderSyncTask', function() {
	it('test new file', function() {
		var builder = new DataBuilder('/Users/downloads/demo.pkg');
		var response;
		builder.callback = function(data) {
			response = data;
		};
		builder.execute();
		response.file.should.equal('/Users/downloads/demo.pkg.mtd');

	});

	it('test already present file file', function() {
		var builder = new DataBuilder('/Users/downloads/demo.pkg.mtd');
		var response;
		builder.callback = function(data) {
			response = data;
		};
		builder.execute();
		response.file.should.equal('/Users/downloads/demo.pkg.mtd');
	});
});