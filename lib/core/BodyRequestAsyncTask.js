var Http = require('http');
var Url = require('url');
var e = require('../Exceptions');

var BodyDownloader = function(url, start, end, onResponse, options) {

    this.url = Url.parse(url);
    this.header = 'bytes=' + start + '-' + end;
    options = options || {};
    this.method = options.method;
    this.port = options.port;
    this.startByte = start;
    this.onResponse = onResponse;
    this.endByte = end;

    //console.log(this);
};

var _start = function(callback) {
    var self = this;
    self.callback = callback;
    if (this.start == this.endByte) {
        self.callback();
        return;
    }

    var _onStart = function(response) {
        self.connection = 'open';

        response.addListener('data', function(chunk) {

            self.callback(null, {
                data: chunk,
                connection: self.connection
            });
        });

        response.addListener('end', function() {
            self.connection = 'closed';
        });

        self.onResponse(null, response);
    };

    var requestOptions = {
        headers: {
            range: this.header
        },
        hostname: this.url.hostname,
        path: this.url.path,
        method: this.method,
        port: this.port
    };
    Http.request(requestOptions, _onStart).on('error', this.onError).end();
};

BodyDownloader.prototype.onError = function(e) {
    this.callback(e(1002, this.url));
};
BodyDownloader.prototype.execute = _start;

//BodyDownloader.prototype.callback = function() {};
//BodyDownloader.prototype.onEnd = function() {};

module.exports = BodyDownloader;