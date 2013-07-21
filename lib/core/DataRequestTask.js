var a = require('async');

var DataRequest = function(writer, threads, metaBuilder, timer, threadUpdator, threadsDestroyer, cParams) {

	this.writer = writer;
	this.threads = threads;
	this.metaBuilder = metaBuilder;
	this.timer = timer;
	this.threadUpdator = threadUpdator;
	this.threadsDestroyer = threadsDestroyer;
	this.cParams = cParams;
	this.destroyed = false;

};

DataRequest.prototype.execute = function(callback) {
	var self = this;
	var cParams = self.cParams;

	var onTimeout = function(err) {
		self.threadsDestroyer();
		self.destroyed = true;
		callback(err);
	};
	self.timer('start', onTimeout);

	var onDownloadComplete = function() {
		if (self.destroyed === false) {
			self.timer('stop');
			callback();
		}
	};

	a.each(this.threads, function(item, callback) {

		var _onMetaBuild = function(err, response) {
			self.writer(response.data, response.position);
		};

		var _bodyCallback = function(err, response) {


			if (!err) {

				if (response.event == 'data') {
					self.writer(response.data, item.position);
					self.metaBuilder(_onMetaBuild);
				}
			}

			self.threadUpdator(item, err, response, self.destroyed, callback);

			if (err) {
				callback(err);
			}

		};
		item.bodyRequest(_bodyCallback);

	}, onDownloadComplete);

};

module.exports = DataRequest;