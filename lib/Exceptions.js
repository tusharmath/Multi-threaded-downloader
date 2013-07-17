var _ = require('underscore');

var error = 0;
var warning = 1;
var information = 2;

var codes = {
    1000: {
        type: error,
        message: 'no [.mtd] file found on {0}'
    },
    1001: {
        type: error,
        message: 'download request timed out after {0} ms'
    },
    1002: {
        type: error,
        message: 'data could not be downloaded from: {0}'
    },
    1003: {
        type: error,
        message: 'invalid file path:  {0}'
    },
    1004: {
        type: error,
        message: 'head request to {0} failed'
    },
    1005: {
        type: error,
        message: 'provide both the [--url] and .mtd [--file] path to start a new download'
    },
    1006: {
        type: error,
        message: '[--file] parameter to [resume] command should contain a valid .mtd file'
    },
    1007: {
        type: error,
        message: 'file handle could not be created on path: {0}'
    },
    1008: {
        type: error,
        message: 'head request failed to retrive file size on: {0}'
    },
    1009: {
        type: error,
        message: 'url could not be parsed from: {0}'
    },
    1010: {
        type: error,
        message: 'callback not specified'
    }
};

var _builder = function(str, items) {
    var list = str.split(/\{[0-9]\}/g);
    var i = 0,
        j = 0;
    var message = _.zip(list, items);
    return _.flatten(message).join('');
};

module.exports = function(code) {
    var item = codes[code];
    var message = item.message;

    var c = _.rest(arguments);
    if (c.length > 0) {
        message = _builder(item.message, c);
    }


    if (item.type == error) return new Error(message);
    if (item.type == warning) return {
        warning: message
    };
    else return message;
};