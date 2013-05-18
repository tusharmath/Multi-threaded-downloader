var extensionMap = {
	'video/x-flv': '.flv',
	'video/mp4': '.mp4'
};

var getLastToken = function(str, key) {
	var tokens = str.split(key);
	return tokens[tokens.length - 1];
};

var getname = function(name) {
	name = decodeURIComponent(name);
	if (name.match(/\=/g)) {
		return getname(getLastToken(name, '='));
	} else if (name.match(/\\/g)) {
		return getname(getLastToken(name, '\\'));
	}
	return name;
};

var _export = function(fromUrl, contentType) {
	this.name = getname(fromUrl);
	this.extension = extensionMap[contentType.toLowerCase()];
	this.fullName = this.name + this.extension;
};

module.exports = _export;