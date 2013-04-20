#!/usr/bin/env node

var program = require('commander');
var nd = require('./ndRequest');

function range(val) {
  return val.split('..').map(Number);
}

function list(val) {
  return val.split(',');
}

program
  .version('0.0.1')
  .usage('test')
  .option('-t, --threads <n>', 'Total number of threads', parseInt)
  .option('-p, --path <path>', 'Save file to.')
  .option('-u, --url <path>', 'Download file from')
  .parse(process.argv);

//return;
var req = new nd(program);
req.start();