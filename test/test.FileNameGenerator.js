var should = require('should');
FileNameGenerator = require('../lib/core/FileNameGeneratorSync');

var DownloadReader;
describe('FileNameGeneratorTask', function() {


	it('test execute method with apple.txt', function(done) {
		var fileGenerator = new FileNameGenerator('apple.txt');

		var callback = function(callback, result) {
			result.downloadFile.should.equal('apple.txt.mtd');
			result.originalFile.should.equal('apple.txt');
			done();
		};
		fileGenerator.execute(callback);
	});

	it('test execute method with apple.txt.mtd', function(done) {

		var fileGenerator = new FileNameGenerator('apple.txt.mtd');

		var callback = function(callback, result) {
			result.downloadFile.should.equal('apple.txt.mtd');
			result.originalFile.should.equal('apple.txt');
			done();
		};
		fileGenerator.execute(callback);
	});
});