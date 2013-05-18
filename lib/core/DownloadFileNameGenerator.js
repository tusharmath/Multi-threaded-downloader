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


	console.log('haha');
	return name;
};

module.exports = function(url) {
	match = 0;
	var name = getname(url);
	return name;
};