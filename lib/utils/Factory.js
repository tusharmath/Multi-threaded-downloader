var Mocked = require('../../test/mock/mock.requires');
var Factory = function() {
	this.loadedModules = {};
};

Factory.prototype.init = function(useMocked, modules) {

	var workingDirectory = '../core/';
	modules = modules || {
		'ThreadRecordReader': 'fs',
		'Analytics': '',
		'ThreadsGenerator': ''
	};

	for (var i in modules) {

		this.loadedModules[i] = require(workingDirectory + i);
		if (this.loadedModules[i] instanceof Function) {

			this.loadedModules[i].prototype.requires = {};

			var required = modules[i].split(' ');
			var self = this;
			required.forEach(function(req) {
				if (useMocked === true) {
					self.loadedModules[i].prototype.requires[req] = Mocked[req];
				} else {
					self.loadedModules[i].prototype.requires[req] = require(req);
				}
			});
		}
	}
};

Factory.prototype.create = function(item, options, singleton) {

	if (singleton) {
		if (singleton.destroy) {
			this.loadedModules[item].destroy = true;
		}
		this.loadedModules[item].create(options);
		return this.loadedModules[item];
	}
	return new this.loadedModules[item](options);
};

module.exports = Factory;