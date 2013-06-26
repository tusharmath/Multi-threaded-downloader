//REQUIRES
var async = require('async');
var HeadRequest = require('./core/HeadRequestAsyncTask');

var FileHandler = require('./core/FileHandlerAsyncTask');

var FileNameGenerator = require('./core/FileNameGeneratorSync');
var ThreadsGenerator = require('./core/ThreadsGeneratorSyncTask');

var SetThreadHeaders = require('./core/SetThreadHeadersTask');
var MetaDataBuilder = require('./core/MetaDataBuilderSyncTask');

var DownloadWriter = require('./core/DownloadWriterAsyncTask');
var DownloadReader = require('./core/DownloadReaderAsyncTask');

var DataRequest = require('./core/DataRequestSyncTask');

// Initialize and execute tasks
var taskInit = function(callback, executeParams) {
	this.callback = function(result) {
		callback(null, result);
	};
	this.execute(executeParams);
};

//TASKS SETUP
var setupTasks = function() {
	var self = this;
	this.tasks = {
		'write-meta-data': ['head-request', 'file-handle-generator', 'generate-meta-data', function(callback, results) {

			var req = new DownloadWriter(results['file-handle-generator']);
			//console.log(results['generate-meta-data']);
			taskInit.call(req, callback, results['generate-meta-data']);

		}],

		'data-request': ['read-meta-data', 'file-handle-generator', function(callback, results) {

			var meta = results['read-meta-data'];
			console.log(meta);
			var req = new DataRequest(meta.threads, meta.url, results['file-handle-generator'], meta.fileSize);
			taskInit.call(req, callback);
			req.execute();
		}],

		'read-meta-data': ['write-meta-data', 'file-handle-generator', function(callback, results) {
			var req = new DownloadReader(results['file-handle-generator'], results['head-request'].fileSize);
			taskInit.call(req, callback);
		}],

		'generate-meta-data': ['file-name-generator', 'threads-generator', 'file-handle-generator', function(callback, results) {
			var req = new MetaDataBuilder(results['threads-generator'], self.url, results['head-request'].fileSize, results['file-handle-generator']);
			taskInit.call(req, callback);
		}],

		'threads-generator': ['head-request', function(callback, results) {
			var req = new ThreadsGenerator(results['head-request'].fileSize);
			taskInit.call(req, callback);
		}],

		'head-request': function(callback, results) {
			var req = new HeadRequest(self.url);
			taskInit.call(req, callback);
		},

		'file-name-generator': function(callback, results) {
			var req = new FileNameGenerator(self.file);
			taskInit.call(req, callback);
		},

		'set-thread-headers': ['threads-generator', function(callback, results) {
			var req = new SetThreadHeaders(results['threads-generator']);
			taskInit.call(req, callback);
		}],

		'file-handle-generator': ['file-name-generator', function(callback, results) {

			var req = new FileHandler(results['file-name-generator'].downloadFile);
			taskInit.call(req, callback);
		}]
	};
};
var TaskExecuter = function(file, url, options) {
	this.file = file;
	this.url = url;
	setupTasks.call(this, this.callback);
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



/*
	## New Download
	* Head request (get file size etc.)
		Create Threads
			Create MetaData
				File Handler
					Write MetaDAta
						Read MetaData
							Create Threads
								Body Download
									Write Data
									Write Meta Data
	
	## Reading Download File
	File Handler
		Read MetaData
			Body Download
				Write MetaDAta
				Write Data
	
*/