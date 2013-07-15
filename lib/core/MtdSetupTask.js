var HeadRequest = require('./HeadRequestAsyncTask');

//var CommonOptions = require('./SetCommonOptionsTask');
var AutoExecuter = require('./AutoExecuterTask');

var FileHandler = require('./FileHandlerAsyncTask');
var Truncator = require('./TruncateAsyncTask');

var FileNameGenerator = require('./FileNameGeneratorSync');
var Renamer = require('./RenameAsyncTask');
var ThreadsGenerator = require('./ThreadsGeneratorSyncTask');

var MetaDataBuilder = require('./MetaDataBuilderSyncTask');

var DownloadWriter = require('./DownloadWriterAsyncTask');
var DownloadReader = require('./DownloadReaderAsyncTask');

var DownloadSetup = require('./DownloadSetup');


var DownloadTask = function(downloadType) {
    this.tasks = {};
    this.downloadType = downloadType;
};

var DependencySetup_NewDownload = function() {

    this.tasks = {
        'write-meta-data': {
            lib: DownloadWriter,
            cParams: ['file-handle-generator'],
            eParams: ['generate-meta-data.data', 'generate-meta-data.writePosition'],
            needs: ['generate-meta-data']
        },


        'download-setup': {
            lib: DownloadSetup
        },
        'download-execute': {
            lib: AutoExecuter,
            needs: ['download-setup', 'read-meta-data']
        },
        /*'data-request-executer': {
            lib: AsyncWaterfallGenerator,
            cParams: ['data-request-generator'],
            needs: ['data-request-generator']
        },*/
        'truncate-file': {
            lib: Truncator,
            cParams: ['file-handle-generator', 'read-meta-data.fileSize'],
            needs: ['data-download', 'file-handle-generator']
        },

        'read-meta-data': {
            lib: DownloadReader,
            cParams: ['file-handle-generator', 'cParams'],
            needs: ['write-meta-data']
        },
        'rename-file': {
            lib: Renamer,
            cParams: ['file-name-generator.downloadFile', 'file-name-generator.originalFile'],
            needs: ['truncate-file', 'file-name-generator']
        },

        'generate-meta-data': {
            lib: MetaDataBuilder,
            cParams: ['threads-generator', 'head-request.fileSize', 'cParams.url', 'cParams.method', 'cParams.port', 'cParams'],
            needs: ['threads-generator']
        },
        'threads-generator': {
            lib: ThreadsGenerator,
            cParams: ['head-request.fileSize', 'cParams.count', 'cParams.range'],
            needs: ['head-request']
        },

        'head-request': {
            lib: HeadRequest,
            cParams: ['cParams.url', 'cParams']
        },

        'file-name-generator': {
            lib: FileNameGenerator,
            cParams: ['cParams.file']
        },

        'file-handle-generator': {
            lib: FileHandler,
            cParams: ['file-name-generator.downloadFile', 'cParams.truncate'],
            needs: ['file-name-generator']
        }
    };
};


DownloadTask.prototype.execute = function() {
    if (this.downloadType == 'new') {
        DependencySetup_NewDownload.call(this);
    } else if (this.downloadType == 're') {
        DependencySetup_ReDownload.call(this);
    }
    this.callback(null, this.tasks);
};

module.exports = DownloadTask;