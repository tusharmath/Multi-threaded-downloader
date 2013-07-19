var _ = require('underscore');
var e = require('../Exceptions');

var DownloadTimeoutTask = function(threads, options) {
    this.threads = threads;

    //Optional
    options = options || {};
    this.timeout = options.timeout || 5; // 10 Seconds timeout

    //Defaults
    this.totalBytesDownloaded = 0;

    //this.downloadSize = _.last(threads).end - _.first(threads).start;
};

var _execute = function(callback) {
    var self = this;
    this.callback = callback;

    this.timer = setInterval(function() {

        var bytesDownloaded = _.reduce(self.threads, function(result, thread) {
            return result + thread.position - thread.start;
        }, 0);

        if (bytesDownloaded > self.totalBytesDownloaded) {
            // All is well
            self.totalBytesDownloaded = bytesDownloaded;
        } else {
            //Incomplete Download
            self.stop();
            self.callback(e(1001, self.timeout));
        }
    }, this.timeout * 1000);
    self.callback(null, function() {
        self.stop();
    });
};

DownloadTimeoutTask.prototype.execute = _execute;
DownloadTimeoutTask.prototype.stop = function() {
    clearInterval(this.timer);
};

module.exports = DownloadTimeoutTask;