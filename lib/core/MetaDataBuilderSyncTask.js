var MetaDataBuilder = function(threads, fileSize, url, method, port, options) {
    this.data = {
        threads: threads,
        url: url,
        method: method,
        port: port,
        downloadSize: fileSize
    };
    options = options || {};
    this.block = options.block || 1024 * 10;
};


MetaDataBuilder.prototype.execute = function(callback) {
    this.callback = callback;
    var buffer = new Buffer(this.block);
    buffer.fill(' ');

    var dataString = JSON.stringify(this.data);
    buffer.write(dataString);

    // console.log('data-length:', dataString.length, buffer.length);

    var result = {
        data: buffer,
        position: this.data.downloadSize
    };

    this.callback(null, result);
};

module.exports = MetaDataBuilder;