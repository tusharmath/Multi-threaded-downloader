#!/usr/bin/env node

var program = require('commander');
var nd = require('./ndRequest');

program.version('0.0.1')
	.option('-u, --url', 'download url')
	.option('-p, --path', 'file save path')
	.option('-t, --threads', 'number of threads.')

	.parse(process.argv);

var req = new nd(program);
req.start();