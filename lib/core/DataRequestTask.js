var a = require('async');
var _ = require('underscore');
var u = require('../Utils');

var DataRequest = function(writer, threads, metaBuilder, timer, fileSize, cParams) {
	this.writer = writer;
	this.threads = threads;
	this.metaBuilder = metaBuilder;
	this.timer = timer;
	this.fileSize = fileSize;
	this.cParams = cParams;
};


DataRequest.prototype.execute = function(callback) {
	var self = this;
	self.callback = callback;
	var cParams = self.cParams;

	var onTimeout = function(err, stopper) {
		if (err) {

			_.each(self.threads, function(item) {
				if (item.destroy) item.destroy();
			});
			self.timerStopper();
			self.destroyed = true;
			self.callback(err);
		} else {
			self.timerStopper = stopper;
		}
	};

	self.timer(onTimeout);

	a.each(this.threads, function(item, callback) {

		var _onMetaBuild = function(err, response) {
			self.writer(response.data, response.position);
		};

		var _bodyCallback = function(err, response) {

			if (err) {
				callback(err);
				return;
			}

			if (item.destroy === undefined) item.destroy = response.destroy;
			if (self.destroyed === true) item.destroy();
			if (response.event == 'data') {
				self.writer(response.data, item.position);
				self.metaBuilder(_onMetaBuild);
				item.position += response.data.length;

			} else if (response.event == 'end') {
				item.connection = 'closed';
				if (item.position < item.end) {
					item.connection = 'failed';
				}
				callback();
			}

		};

		item.bodyRequest(_bodyCallback);

	}, function() {
		if (self.destroyed !== true) {
			self.callback();
			self.timerStopper();
		}

	});


	if (cParams.onStart) cParams.onStart({
		url: self.url,
		size: self.fileSize,
		threads: self.threads
	});
};

module.exports = DataRequest;