var async = require('async');
var BodyRequest = require('./BodyRequestAsyncTask');
var DownloadWriter = require('./DownloadWriterAsyncTask');
var MetaDataBuilder = require('./MetaDataBuilderSyncTask');

var Task = function(threads, url, fd, file, fileSize, options) {

	this.threads = threads;
	this.url = url;
	this.fd = fd;
	this.file = file;
	this.fileSize = fileSize;

	this.options = options;

};

var _execute = function() {
	var self = this;


	var metaBuilder = new MetaDataBuilder();


	async.each(this.threads, function(item, callback) {


		async.waterfall([

		//Make Body request

		function(callback) {
			var req = new BodyRequest(self.url, item.header, function(dataChunk) {
				callback(null, dataChunk, item);
			});

			req.callback = function() {
				if (item.position != item.end) {
					item.connection = 'failed';
				}
			};

			req.execute();
		},


		//On Data Recieved

		function(dataChunk, thread, callback) {
			var writer = new DownloadWriter(self.fd);

			var executerArgs = {
				data: dataChunk,
				position: item.position
			};

			writer.callback = function(bytes) {
				callback(null, bytes, thread);
			};

			writer.execute(executerArgs);
		},

		//On File Written
		//Update position

		function(bytes, thread, callback) {
			thread.position += bytes;
			if (thread.position === thread.end) {
				thread.connection = 'closed';
			}
			callback();
		},


		//Generate Meta Data

		function(callback) {
			var builder = new MetaDataBuilder(self.file, self.threads, self.url);
			builder.callback = function(response) {
				callback(null, response);
			};
		},

		//Write Meta Data

		function(response, position, callback) {
			var writer = new DownloadWriter(self.fd);
			writer.callback = function(bytes) {
				callback(null, bytes);
			};
			writer.execute(response, position);

		}


		], callback);


	}, this.callback);
};

Task.prototype.execute = _execute;



module.exports = Task;