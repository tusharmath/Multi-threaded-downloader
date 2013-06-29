var HeadRequest = require('./core/HeadRequestAsyncTask');

//var CommonOptions = require('./core/SetCommonOptionsTask');
var FileHandler = require('./core/FileHandlerAsyncTask');
var Truncator = require('./core/TruncateAsyncTask');

var FileNameGenerator = require('./core/FileNameGeneratorSync');
var Renamer = require('./core/RenameAsyncTask');
var ThreadsGenerator = require('./core/ThreadsGeneratorSyncTask');

var SetThreadHeaders = require('./core/SetThreadHeadersTask');
var MetaDataBuilder = require('./core/MetaDataBuilderSyncTask');

var DownloadWriter = require('./core/DownloadWriterAsyncTask');
var DownloadReader = require('./core/DownloadReaderAsyncTask');

var DataRequest = require('./core/DataRequestSyncTask');


var DependencySetup_NewDownload = function() {

	this.tasks['write-meta-data'].needs = ['head-request', 'file-handle-generator', 'generate-meta-data'];
	this.tasks['data-request'].needs = ['read-meta-data', 'file-handle-generator'];
	this.tasks['truncate-file'].needs = ['data-request', 'file-handle-generator', 'read-meta-data'];
	this.tasks['read-meta-data'].needs = ['write-meta-data', 'file-handle-generator'];
	this.tasks['rename-file'].needs = ['truncate-file', 'file-name-generator'];
	this.tasks['generate-meta-data'].needs = ['set-thread-headers', 'file-name-generator', 'threads-generator', 'file-handle-generator'];
	this.tasks['threads-generator'].needs = ['head-request'];
	this.tasks['set-thread-headers'].needs = ['threads-generator'];
	this.tasks['file-handle-generator'].needs = ['file-name-generator'];
	this.tasks['file-name-generator'].needs = ['common-options'];

};


var DependencySetup_ReDownload = function() {
	this.tasks['data-request'].needs = ['read-meta-data'];
	this.tasks['truncate-file'].needs = ['data-request'];
	this.tasks['read-meta-data'].needs = ['file-handle-generator'];
	this.tasks['rename-file'].needs = ['truncate-file'];
	this.tasks['file-handle-generator'].needs = ['file-name-generator'];
	this.tasks['file-name-generator'].needs = ['common-options'];
};

var TaskSetup = function(setupType, options) {

	this.options = options;

	this.tasks = {
		'write-meta-data': {
			lib: DownloadWriter,
			cParams: ['file-handle-generator'],
			eParams: ['generate-meta-data']
		},

		'data-request': {
			lib: DataRequest,
			cParams: ['read-meta-data', 'head-request', 'file-handle-generator', 'common-options']
		},
		'truncate-file': {
			lib: Truncator,
			cParams: ['file-handle-generator', 'read-meta-data']
		},

		'read-meta-data': {
			lib: DownloadReader,
			cParams: ['file-handle-generator']
		},
		'rename-file': {
			lib: Renamer,
			cParams: ['file-name-generator']
		},

		'generate-meta-data': {
			lib: MetaDataBuilder,
			cParams: ['threads-generator', 'head-request', 'file-handle-generator', 'common-options']
		},
		'threads-generator': {
			lib: ThreadsGenerator,
			cParams: ['head-request', 'common-options']
		},

		'head-request': {
			lib: HeadRequest,
			cParams: ['common-options']
		},

		'file-name-generator': {
			lib: FileNameGenerator,
			cParams: ['common-options']
		},
		'set-thread-headers': {
			lib: SetThreadHeaders,
			cParams: ['threads-generator']
		},
		'file-handle-generator': {
			lib: FileHandler,
			cParams: ['file-name-generator']
		}
	};

	if (setupType == 'new') {
		DependencySetup_NewDownload.call(this);
	} else if (setupType == 're') {
		DependencySetup_ReDownload.call(this);
	}
};

module.exports = TaskSetup;