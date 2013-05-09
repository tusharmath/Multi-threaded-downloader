#!/usr/bin/env node

var argv = require('optimist')
	.usage('\nUsage: $0 -u [url] -f [fileName] -c [checksum] \n\nEg. $0 -u http://code.jquery.com/jquery-1.9.1.js -f jquery.min.js -c sha1:9257afd2d46c3a189ec0d40a45722701d47e9ca5')
	.options('f', {
	alias: 'fileName'
})
	.options('u', {
	alias: 'url'
})
	.options('c', {
	alias: 'checksum'
})
	.describe('c', 'type:digest')
	.demand(['f', 'u'])
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

var downloader = new core(argv);
downloader.download();