var json5 = require('json5');
var fs = require('fs');
var defaultConfig = __dirname + '/config.json';
var userConfig = __dirname + '/userconfig.log';
var encoding = {
	encoding: 'utf8'
};

//
var _setUserConfig = function(path) {
	path += '/mt-downloader.config.json';

	//read default config
	var configData = fs.readFileSync(defaultConfig, encoding);

	//write userconfig
	fs.writeFileSync(path, configData, encoding);

	//write userconfig.txt
	fs.writeFileSync(userConfig, path, encoding);



};

//
var getConfig = function(path) {

	var configData = fs.readFileSync(path, encoding);
	var config = json5.parse(configData);
	config.setUserConfig = _setUserConfig;
	console.log('Config loaded:', path);
	return config;
};

//
if (fs.existsSync(userConfig)) {
	var userConfigPath = fs.readFileSync(userConfig, encoding);
	if (fs.existsSync(userConfigPath)) {
		module.exports = getConfig(userConfigPath);
	} else {
		module.exports = getConfig(defaultConfig);
	}

} else {
	module.exports = getConfig(defaultConfig);
}