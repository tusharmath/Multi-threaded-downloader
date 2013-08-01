var u = require('./Utils');
var a = require('async');

//HTTP
var HeadRequest = require('./core/HeadRequestAsyncTask');
var DataRequest = require('./core/DataRequestTask');

//FILE
var FileHandler = require('./core/FileHandlerAsyncTask');
var Truncator = require('./core/TruncateAsyncTask');
var FileNameGenerator = require('./core/FileNameGeneratorSync');
var Renamer = require('./core/RenameAsyncTask');

//Threads
var ThreadsGenerator = require('./core/ThreadsGeneratorSyncTask');

//META DATA
var MetaDataBuilder = require('./core/MetaDataBuilderSyncTask');


//READ WRITE
var DownloadWriter = require('./core/DownloadWriterAsyncTask');
var DownloadReader = require('./core/DownloadReaderAsyncTask');


//EXECUTOR
var ExecutorGenerator = require('./core/ExecutorGenerator');

//INDICATOR
var StartIndicator = require('./core/StartIndicator');

//VALIDATOR
var DownloadValidator = require('./core/DownloadValidator');

var Setup_New_Download = function(cParams) {
	this.cParams = cParams;
};

Setup_New_Download.prototype.execute = function(callback) {
	var cParams = this.cParams;

	this.tasks = {

		//HTTP
		'http-head': ['file-handle', function(callback, results) {
			u.executor(HeadRequest, cParams.url, cParams)(callback);
		}],

		//THREADS
		'threads-generate': ['http-head',

		function(callback, results) {
			u.executor(ThreadsGenerator,
			results['http-head'].fileSize,
			cParams)(callback);
		}],

		//FILE
		'file-name': a.apply(u.executor(FileNameGenerator,
		cParams.file)),

		'file-handle': ['file-name',

		function(callback, results) {
			u.executor(FileHandler,
			results['file-name'].downloadFile, true)(callback);
		}],

		'file-truncate': ['validate-download',

		function(callback, results) {
			u.executor(Truncator,
			results['file-handle'],
			results['meta-read'].downloadSize)(callback);
		}],



		'file-rename': ['file-truncate',

		function(callback, results) {
			u.executor(Renamer,
			results['file-name'].downloadFile,
			results['file-name'].originalFile)(callback);
		}],



		//META(UPDATE AND WRITE TIMELY)
		'meta-generate': ['threads-generate',

		function(callback, results) {
			u.executor(MetaDataBuilder,
			results['threads-generate'],
			results['http-head'].fileSize,
			cParams.url,
			cParams.method,
			cParams.port,
			results['http-head'].headers,
			cParams)(callback);
		}],


		'meta-write': ['meta-generate', 'file-handle',

		function(callback, results) {
			u.executor(DownloadWriter,
			results['file-handle'])(results['meta-generate'].data,
			results['meta-generate'].position,
			callback);
		}],
		'meta-read': ['meta-write',

		function(callback, results) {

			u.executor(DownloadReader,
			results['file-handle'],
			cParams)(callback);
		}],

		//INDICATOR
		'start-indicator': ['meta-read', function(callback, results) {
			u.executor(StartIndicator,
			results['meta-read'].threads,
			results['meta-read'].downloadSize,
			results['meta-read'].url,
			results['meta-read'].headers,
			cParams)(callback);
		}],
		//EXECUTOR GENERATOR
		'executor-generator': ['meta-read', function(callback, results) {
			u.executor(ExecutorGenerator,
			results['file-handle'],
			results['meta-read'].threads,
			results['meta-read'].downloadSize,
			results['meta-read'].url,
			results['meta-read'].method,
			results['meta-read'].port,
			results['meta-read'].headers,
			cParams)(callback);
		}],

		//VALIDATE DOWNLOAD
		'validate-download': ['http-data',

		function(callback, results) {
			u.executor(DownloadValidator, results['meta-read'].threads)(callback);
		}],

		//DATA
		'http-data': ['executor-generator',

		function(callback, results) {
			u.executor(DataRequest,
			results['executor-generator'].writer,
			results['executor-generator'].threads,
			results['executor-generator'].metaBuilder,
			results['executor-generator'].timer,
			results['executor-generator'].threadUpdator,
			results['executor-generator'].threadsDestroyer,
			results['meta-read'].downloadSize,
			cParams)(callback);
		}]
	};
	callback(this.tasks);
};

module.exports = Setup_New_Download;