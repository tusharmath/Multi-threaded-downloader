var mime_map = {
	'video/x-flv': '.flv',
	'video/mp4': '.mp4',
	'mtd-default': ''
};

var getLastToken = function(str, key) {
	var tokens = str.split(key);
	return tokens[tokens.length - 1];
};

var getname = function(name) {
	if (name === undefined) return;
	name = decodeURIComponent(name);
	if (name.match(/\=/g)) {
		return getname(getLastToken(name, '='));
	} else if (name.match(/\\/g)) {
		return getname(getLastToken(name, '\\'));
	}
	return name;
};

var _export = function(options) {
	this.name = getname(options.url) || 'download';
	this.extension = mime_map[options.mime || 'mtd-default'];
	this.fullName = this.name + this.extension;
};

module.exports = _export;