var Mocked = require('../../test/mock/mock.requires');

var loadDependencies = function(module, moduleName) {
	if (module.requires !== undefined) {
		var dependencies = module.requires.split(' ');
		var req = this.modules[moduleName].prototype.requires;

		for (var j = 0; j < dependencies.length; j++) {

			if (module.useMocked === true) {

				req[dependencies[j]] = Mocked[dependencies[j]];
			} else {
				req[dependencies[j]] = require(dependencies[j]);

			}

		}
	}
};

var loadModule = function(moduleName) {
	this.modules[moduleName] = require(this.moduleDirectory + moduleName);
	this.modules[moduleName].prototype.requires = {};
};

var Factory = {
	modules: {},
	singletonObjects: {},
	moduleDirectory: '../core/',
	remove: function(moduleName) {
		delete this.modules[moduleName];
	},
	register: function(modules, useMocked) {
		if (!(modules instanceof Array)) {
			modules = [modules];
		}
		for (var i = 0; i < modules.length; i++) {


			var moduleName = Object.keys(modules[i])[0];
			var module = modules[i][moduleName];

			if (this.modules[moduleName] === undefined) {
				//Loading module
				loadModule.call(this, moduleName);
				loadDependencies.call(this, module, moduleName);
				if (module.isSingleton === true) {
					this.modules[moduleName].prototype.isSingleton = true;
				}
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