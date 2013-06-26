//REQUIRES
var async = require('async');
var http = require('http');
var HeadRequest = require('./core/HeadRequestAsyncTask');


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


http.globalAgent.maxSockets = 200;
http.Agent.defaultMaxSockets = 200;

// Initialize and execute tasks
var taskInit = function(callback, executeParams) {
	this.callback = function(result) {
		callback(null, result);
	};
	this.execute(executeParams);
};

var TaskExecuter = function(file, url, options) {
	this.file = file;
	this.options = options;


	var tasks = {
		'write-meta-data': function(callback, results) {

			var req = new DownloadWriter(results['file-handle-generator']);
			//console.log(results['generate-meta-data']);
			taskInit.call(req, callback, results['generate-meta-data']);

		},

		'data-request': function(callback, results) {

			var meta = results['read-meta-data'];
			//console.log(meta);
			var req = new DataRequest(meta.threads, meta.url, results['file-handle-generator'], meta.downloadSize);
			taskInit.call(req, callback);
		},

		'truncate-file': function(callback, results) {

			var req = new Truncator(results['file-handle-generator'], results['read-meta-data'].downloadSize);
			taskInit.call(req, callback);

		},

		'read-meta-data': function(callback, results) {
			var req = new DownloadReader(results['file-handle-generator'], results['head-request'].fileSize);
			taskInit.call(req, callback);
		},

		'rename-file': function(callback, results) {
			var req = new Renamer(results['file-name-generator'].downloadFile);
			taskInit.call(req, callback);
		},


		'generate-meta-data': function(callback, results) {
			var req = new MetaDataBuilder(results['threads-generator'], self.url, results['head-request'].fileSize, results['file-handle-generator']);
			taskInit.call(req, callback);
		},

		'threads-generator': function(callback, results) {
			var req = new ThreadsGenerator(results['head-request'].fileSize, {
				count: self.options.threads
			});
			taskInit.call(req, callback);
		},

		'head-request': function(callback, results) {
			var req = new HeadRequest(self.url);
			taskInit.call(req, callback);
		},

		'file-name-generator': function(callback, results) {
			var req = new FileNameGenerator(self.file);
			taskInit.call(req, callback);
		},

		'set-thread-headers': function(callback, results) {
			var req = new SetThreadHeaders(results['threads-generator']);
			taskInit.call(req, callback);
		},

		'file-handle-generator': function(callback, results) {

			var req = new FileHandler(results['file-name-generator'].downloadFile);
			taskInit.call(req, callback);
		}
	};

	//TASKS SETUP
	var setupTasksNew = function() {
		this.tasks = {
			'write-meta-data': ['head-request', 'file-handle-generator', 'generate-meta-data', tasks['write-meta-data']],

			'data-request': ['read-meta-data', 'file-handle-generator', tasks['data-request']],

			'truncate-file': ['data-request', 'file-handle-generator', 'read-meta-data', tasks['truncate-file']],

			'read-meta-data': ['write-meta-data', 'file-handle-generator', tasks['read-meta-data']],

			'rename-file': ['truncate-file', 'file-name-generator', tasks['rename-file']],

			'generate-meta-data': ['set-thread-headers', 'file-name-generator', 'threads-generator', 'file-handle-generator', tasks['generate-meta-data']],

			'threads-generator': ['head-request', tasks['threads-generator']],

			'head-request': tasks['head-request'],

			'file-name-generator': tasks['file-name-generator'],

			'set-thread-headers': ['threads-generator', tasks['set-thread-headers']],

			'file-handle-generator': ['file-name-generator', tasks['file-handle-generator']]
		};
	};


	var setupTasksOld = function() {
		this.tasks = {
			'data-request': ['read-meta-data', tasks['data-request']],

			'truncate-file': ['data-request', tasks['truncate-file']],

			'read-meta-data': ['file-handle-generator', tasks['read-meta-data']],

			'rename-file': ['truncate-file', tasks['rename-file']],

			'file-name-generator': [tasks['file-name-generator']],

			'file-handle-generator': ['file-name-generator', tasks['file-handle-generator']]
		};
	};

	var self = this;
	if (!this.file.match(/\.mtd$/)) {
		this.url = url;
		setupTasksNew.call(this, this.callback);
	} else {
		setupTasksOld.call(this, this.callback);
	}
};

var _start = function() {
	async.auto(this.tasks, this.callback);
};

TaskExecuter.prototype.start = _start;
TaskExecuter.prototype.callback = function(err, results) {

	//TODO: Remove
	//console.log('\n---Results\n', results);
};

module.exports = TaskExecuter;