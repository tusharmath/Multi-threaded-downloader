/**
 * Created by tushar.mathur on 21/01/16.
 */

'use strict'
const Download = require('../index').Download
const crypto = require('crypto')
const fs = require('fs')
const Rx = require('rx')

exports.removeFile = (x) => Rx.Observable.fromCallback(fs.unlink)(x).toPromise()

const createFileDigest = exports.createFileDigest = path => {
  const hash = crypto.createHash('sha1')
  return new Promise(resolve => fs
    .createReadStream(path)
    .on('data', x => hash.update(x))
    .on('end', () => resolve(hash.digest('hex').toUpperCase()))
  )
}

exports.createDownload = function (parameters) {
  var url = parameters.url
  var path = parameters.path
  var mtd = new Download({path, url, strictSSL: false})
  return mtd.start().then(() => createFileDigest(path))
}

exports.fsStat = (x) => Rx.Observable.fromCallback(fs.stat)(x).toPromise()
