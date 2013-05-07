#!/usr/bin/env node

var program = require('commander');
var core = require('../core');

function range(val) {
	return val.split('..').map(Number);
}

function list(val) {
	return val.split(',');
}

program.version('0.0.1')
	.usage('test')
	.option('-f, --fileName <name>', 'Eg: jquery.min.js')
	.option('-u, --url <path>', 'Eg: http://code.jquery.com/jquery-1.9.1.js')
	.option('-c, --checksum', 'Eg: sha1:9257afd2d46c3a189ec0d40a45722701d47e9ca5')
	.parse(process.argv);

//return;
var downloader = new core(program);
downloader.download();