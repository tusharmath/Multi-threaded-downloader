var _ = require('underscore');

var error = 0;
var warning = 1;
var information = 2;

var codes = {
	1000: {
		type: error,
		message: 'No [.mtd] file found on {0}'
	},
	1001: {
		type: error,
		message: 'Download request timed out after {0} seconds. Closing connections'
	},
	1002: {
		type: error,
		message: 'data could not be downloaded from: {0}'
	},
	1003: {
		type: error,
		message: 'Invalid file path:  {0}'
	},
	1004: {
		type: error,
		message: 'Head request failed on host: {0}'
	},
	1005: {
		type: error,
		message: 'Provide both [--url] and [--file] parameters to start a new download'
	},
	1006: {
		type: error,
		message: '[--file] parameter to [resume] command should contain a valid .mtd file'
	},
	1007: {
		type: error,
		message: 'File handle could not be created on path: {0}'
	},
	1008: {
		type: error,
		message: 'Head request failed to retrive file size on: {0}. Could be because 1) Url is invalid, 2) request requires cookies'
	},
	1009: {
		type: error,
		message: 'Url could not be parsed from: {0}'
	},
	1010: {
		type: error,
		message: 'Callback not specified'
	},
	1011: {
		type: error,
		message: 'File could not be saved.'
	},
	1012: {
		type: error,
		message: 'The .mtd file is corrupt. Start a new download.'
	},
	1013 :{
		type:error,
		message: 'Download did not complete successfully.'
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
	else if (item.type == warning) return {
		warning: message
	};

	else return message;
};