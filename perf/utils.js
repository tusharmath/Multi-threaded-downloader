/**
 * Created by tushar.mathur on 21/01/16.
 */

'use strict'
const Download = require('../index').Download
const Path = require('path')
const crypto = require('crypto')
const fs = require('fs')
const Rx = require('rx')

const getPath = x => Path.normalize(Path.join(__dirname, x))
exports.removeFile = (x) => Rx.Observable.fromCallback(fs.unlink)(getPath(x)).toPromise()
const createFileDigest = exports.createFileDigest = path => {
  const hash = crypto.createHash('sha1')
  return new Promise(resolve => fs
    .createReadStream(path)
    .on('data', x => hash.update(x))
    .on('end', () => resolve(hash.digest('hex')))
  )
}
exports.createDownload = function (parameters) {
  var url = parameters.url
  var path = getPath(parameters.path)
  var mtd = new Download({path, url, strictSSL: false})
  return mtd.start().then(() => createFileDigest(path))
}
