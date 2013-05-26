var _getStatus = function() {
	var threads = this.threads;

	if (this.threads) {
		this.fileSize = this.threads[this.threads.length - 1].end;
		this.blockSize = this.fileSize / this.threads.length;


		var i = 0;
		while (i < threads.length) {

			//THREAD POSITIONS
			var t = threads[i++];
			var val = Math.floor((t.position - t.start) * 10000 / (t.end - t.start)) / 100;
			val = val.toString();
			this.threadCompleted.push(val);

			//ACTIVE THREADS
			if (t.connection == 'open') {
				this.openConnections++;
			}

			//COMPLETED THREADS
			if (t.connection == 'closed') {
				this.closedConnections++;
			}

			//FAILED THREADS
			if (t.connection == 'failed') {
				this.failedConnections++;
			}

			//DOWNLOAD SIZE
			this.downloadSize += (t.end - t.start + 1);


			//DATA RECEIVED
			this.dataReceived += (t.position - t.start + 1);

		}

		this.downloadSize--;
		this.dataReceived--;
	}
};


var Analytics = function(options) {
	var options = options || {};
	this.interval = options.interval || 1000;
	this.fileSize = {};
	this.downloadSize = 0;
	this.dataReceived = 0;

	this.downloadSpeed = 0;

	this.completed = 0;
	this.threadCompleted = [];

	this.remaining = 0;
	this.elapsedTime = 0;
	this.estimatedTime = 0;
	this.openConnections = 0;
	this.closedConnections = 0;
	this.failedConnections = 0;


};

var _tick = function() {
	this.elapsedTime += this.interval;
	_getStatus.call(this);
};


Analytics.prototype.tick = _tick;
module.exports = Analytics;