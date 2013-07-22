var should = require('should');
var _ = require('underscore');
var u = require('../lib/Utils');
MetaUpdater = require('../lib/core/MetaDataUpdator');

var DownloadReader;
describe('MetaUpdaterTask', function() {


	it('test execute method ', function(done) {

		var meta = {};
		meta.threads = [{
			connection: 'open'
		}, {
			connection: 'closed'
		}, {
			connection: 'failed'
		}];
		u.executor(MetaUpdater, meta)(function(err, meta) {
			_.each(meta.threads, function(thread) {
				thread.connection.should.equal('idle');
			});
			done();
		});

	});

});