var async = require('async');
var BodyRequest = require('./BodyRequestAsyncTask');
var DownloadWriter = require('./DownloadWriterAsyncTask');
var MetaDataBuilder = require('./MetaDataBuilderSyncTask');

var Task = function(threads, url, fd, fileSize, options) {

	this.threads = threads;
	this.url = url;
	this.fd = fd;

	this.fileSize = fileSize;

	this.options = options;

};

var _execute = function() {
	var self = this;
	//console.log('starting data req with', this.callback);

	var metaBuilder = new MetaDataBuilder();


	async.each(this.threads, function(item, callback) {

		//console.log('on thread', item);
		item.callback = callback;
		async.waterfall([

		//Make Body request


		function(callback) {

			var req = new BodyRequest(self.url, item.header, function(dataChunk) {
				//console.log(dataChunk.length);
				callback(null, dataChunk, item);
			});

			req.callback = function() {
				//console.log('Thread end');
				item.connection = 'closed';

				//item.callback();
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

			//console.log('Writing on:', thread.position, '+', dataChunk.length, '=', thread.position + bytes);
			thread.position += dataChunk.length;
			if (thread.connection === 'closed') {
				//console.log(self.threads);
				if (thread.position != thread.end) {
					thread.connection = 'failed';
				}
				thread.callback();
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


		]);


	}, this.callback);
};

Task.prototype.execute = _execute;



module.exports = Task;