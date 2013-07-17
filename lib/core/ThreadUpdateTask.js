var ThreadUpdate = function(thread) {
    this.thread = thread;
};

ThreadUpdate.prototype.execute = function(length, connection, callback) {
    
    this.thread.position += length;
    if (this.thread.position > this.thread.end) {
        this.thread.position = this.thread.end;
    }
    this.thread.connection = connection;
    callback(null, this.thread);
};

module.exports = ThreadUpdate;