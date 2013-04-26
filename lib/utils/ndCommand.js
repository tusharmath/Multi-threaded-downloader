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
	.option('-f, --fileName <name>', 'file name')
	.option('-u, --url <path>', 'Download path')
	.parse(process.argv);

//return;
var downloader = new core(program);
downloader.download();