var Factory = {};
var Mocked = require('../../test/mock/mock.requires');

Factory.init = function(useMocked) {
	var workingDirectory = '../../test/mock/';
	var modules = {
		'FakeModule': 'fs,http,fake'
	};

	var loadedModules = {};


	for (var i in modules) {
		loadedModules[i] = require(workingDirectory + i);
		loadedModules[i].prototype.requires = {};

		var required = modules[i].split(',');
		required.forEach(function(req) {
			if (useMocked === true) {
				loadedModules[i].prototype.requires[req] = Mocked[req];
			} else {
				loadedModules[i].prototype.requires[req] = require(req);
			}
		});

		this[i] = function() {
			return new loadedModules[i]();
		};
	}

};

module.exports = Factory;