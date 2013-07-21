//UNIVERSALS
var a = require('async');
var u = require('./Utils');

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
var ThreadUpdater = require('./core/ThreadUpdateTask');

//META DATA
var MetaDataBuilder = require('./core/MetaDataBuilderSyncTask');
var MetaDataUpdater = require('./core/MetaDataUpdator');


//READ WRITE
var DownloadWriter = require('./core/DownloadWriterAsyncTask');
var DownloadReader = require('./core/DownloadReaderAsyncTask');


//EXECUTOR
var ExecutorGenerator = require('./core/ExecutorGenerator');

//INDICATOR
var StartIndicator = require('./core/StartIndicator');



var Setup_Re_Download = function(cParams) {
	this.cParams = cParams;
};

Setup_Re_Download.prototype.execute = function(callback) {
	var cParams = this.cParams;

	this.tasks = {

		//EXECUTOR GENERATOR
		'executor-generator': ['meta-update', function(callback, results) {
			u.executor(ExecutorGenerator,
			results['file-handle'],
			results['meta-update'].threads,
			results['meta-update'].downloadSize,
			results['meta-update'].url,
			results['meta-update'].method,
			results['meta-update'].port,
			cParams)(callback);
		}],


		'file-name': a.apply(u.executor(FileNameGenerator, cParams.file)),

		'file-handle': ['file-name',

		function(callback, results) {
			u.executor(FileHandler,
			results['file-name'].downloadFile, false)(callback);
		}],

		'file-truncate': ['http-data',

		function(callback, results) {
			u.executor(Truncator,
			results['file-handle'],
			results['meta-update'].downloadSize)(callback);
		}],



		'file-rename': ['file-truncate',

		function(callback, results) {
			u.executor(Renamer,
			results['file-name'].downloadFile,
			results['file-name'].originalFile)(callback);
		}],

		'meta-read': ['file-handle',

		function(callback, results) {
			u.executor(DownloadReader,
			results['file-handle'],
			cParams)(callback);
		}],

		'meta-update': ['meta-read',

		function(callback, results) {
			u.executor(MetaDataUpdater,
			results['meta-read'],
			cParams)(callback);
		}],

		//INDICATOR
		'start-indicator': ['meta-update', function(callback, results) {
			u.executor(StartIndicator,
			results['meta-update'].threads,
			results['meta-update'].downloadSize,
			results['meta-update'].url,
			cParams)(callback);
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
			results['meta-update'].downloadSize,
			cParams)(callback);
		}]
	};
	callback(this.tasks);
};

module.exports = Setup_Re_Download;