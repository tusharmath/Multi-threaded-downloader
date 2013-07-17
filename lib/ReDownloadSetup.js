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


//READ WRITE
var DownloadWriter = require('./core/DownloadWriterAsyncTask');
var DownloadReader = require('./core/DownloadReaderAsyncTask');

var Setup_Re_Download = function(cParams) {
    this.cParams = cParams;
};

Setup_Re_Download.prototype.execute = function(callback) {
    var cParams = this.cParams;

    this.tasks = {


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
            results['meta-read'].downloadSize)(callback);
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

        //DATA
        'http-data': ['meta-read',

        function(callback, results) {
            u.executor(DataRequest,
            results['meta-read'].url,
            results['meta-read'].threads,
            results['file-handle'],
            results['meta-read'].downloadSize,
            cParams)(callback);
        }]
    };
    callback(this.tasks);
};

module.exports = Setup_Re_Download;