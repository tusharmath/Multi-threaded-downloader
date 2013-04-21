var nd = require('../lib/core');

var options = {
	path: '/Users/tusharmathur/Desktop/Temp/Download.png',
	url: 'http://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
	threadCount: 4

};


var _options = {
	path: '/Users/tusharmathur/Desktop/Temp/VirtualBox-4.2.12-84980-OSX.dmg',
	url: 'http://dlc.sun.com.edgesuite.net/virtualbox/4.2.12/VirtualBox-4.2.12-84980-OSX.dmg',
	threadCount: 4

};

nd.download(options);