var should = require('should');
var DataBuilder = require('../lib/core/MetaDataBuilderSyncTask');

describe('MetaDataBuilderSyncTask', function() {
	it('test new file', function() {
		var builder = new DataBuilder({
			file: '/Users/downloads/demo.pkg'
		});
		builder.file.should.equal('/Users/downloads/demo.pkg.mtd');

	});

	it('test already present file file', function() {
		var builder = new DataBuilder({
			file: '/Users/downloads/demo.pkg.mtd'
		});
		builder.file.should.equal('/Users/downloads/demo.pkg.mtd');

	});
});