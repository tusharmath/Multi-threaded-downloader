var BodyRequest = require('./BodyRequestAsyncTask');
var DownloadWriter = require('./DownloadWriterAsyncTask');
var MetaDataBuilder = require('./MetaDataBuilderSyncTask');



var DownloadDataTask = function() {};
DownloadDataTask.prototype.execute = function() {
    this.tasks = {
        'data-request': {
            lib: BodyRequest,
            cParams: ['cParams.url', 'cParams.start', 'cParams.end', 'cParams']
        },
        'data-write': {
            lib: DownloadWriter,
            cParams: ['cParams.fd'],
            eParams: ['data-request.data', 'cParams.position'],
            needs: ['data-request']
        },
        'meta-generate': {
            lib: MetaDataBuilder,
            cParams: ['cParams.threads', 'cParams.fileSize', 'cParams.url', 'cParams.method', 'cParams.port', 'cParams'],
            needs: ['data-request']
        },
        'meta-write': {
            lib: DownloadWriter,
            cParams: ['cParams.fd'],
            eParams: ['meta-generate.data', 'meta-generate.position']
        }
    };

    this.callback(null, this.tasks);
};
module.exports = DownloadDataTask;