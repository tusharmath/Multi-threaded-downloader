var Mocked = require('../../test/mock/mock.requires');

var loadDependencies = function(options, moduleName) {

	var module = this.modules[moduleName];

	if (module.prototype.using !== undefined) {


		var dependencies = module.prototype.using.split(' ');

		var req = {};

		for (var j = 0; j < dependencies.length; j++) {

			if (options.indexOf('mock') > -1) {

				req[dependencies[j]] = Mocked[dependencies[j]];
			} else {
				req[dependencies[j]] = require(dependencies[j]);

			}

		}

		module.prototype.requires = req;
	}
};

var loadModule = function(moduleName) {

	this.modules[moduleName] = require(this.moduleDirectory + moduleName);

	this.modules[moduleName].prototype.requires = this.modules[moduleName].prototype.requires || {};
};

var Factory = {
	modules: {},
	singletonObjects: {},
	moduleDirectory: '../core/',
	remove: function(moduleName) {
		delete this.modules[moduleName];
	},
	register: function(moduleName, options) {
		options = options || '';

		if (this.modules[moduleName] === undefined) {

			//Loading module

			loadModule.call(this, moduleName);

			loadDependencies.call(this, options, moduleName);
			if (options.indexOf('singleton') > -1) {
				this.modules[moduleName].prototype.isSingleton = true;
			}
		}
	},
	create: function(item, options, destroy) {
		//console.log(this.modules[item].prototype);
		if (this.modules[item].prototype.isSingleton) {
			if (destroy === true) {
				delete this.singletonObjects[item];
			}
			if (this.singletonObjects[item] === undefined) {
				this.singletonObjects[item] = new this.modules[item](options);
			}
			return this.singletonObjects[item];
		}
		return new this.modules[item](options);
	}
};
module.exports = Factory;