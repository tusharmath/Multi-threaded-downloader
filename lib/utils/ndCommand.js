#!/usr/bin/env node

var config = require('../core/ndOptions');

var argv = require('optimist')
	.usage('\nUsage: $0 -u [url] -f [fileName] -c [checksum] \n\nConfig: ' + __dirname + '\/ndOptions.js\n\nEg. $0 -u http://code.jquery.com/jquery-1.9.1.js -f jquery.min.js -c sha1:9257afd2d46c3a189ec0d40a45722701d47e9ca5')
	.alias('f', 'fileName')
	.alias('u', 'url')
	.alias('c', 'checksum')
	.describe('c', 'checksum eg: sha1:65742a2194185790925a4dcd6105ca27eb3e386a')
	.describe('f', 'file name eg: vlc-2.0.6.dmg')
	.describe('u', 'url eg: http://mirror.switch.ch/ftp/mirror/videolan/vlc/2.0.6/macosx/vlc-2.0.6.dmg')
	//.demand('u')
	.argv;
var core = require('../core');
/*
program.version('0.0.1')
	.usage('test')
	.option('-f, --fileName <name>', 'Eg: jquery.min.js')
	.option('-u, --url <path>', 'Eg: http://code.jquery.com/jquery-1.9.1.js')
	.option('-c, --checksum', 'Eg: sha1:9257afd2d46c3a189ec0d40a45722701d47e9ca5')
	.parse(process.argv);
*/
//return;
if (argv.config) {
	config.setUserConfig(argv.config);
} else {
	var downloader = new core(argv);
	downloader.download();
}