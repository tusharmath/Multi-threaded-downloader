/**
 * Created by tushar.mathur on 21/01/16.
 */

'use strict'
const crypto = require('crypto')
const fs = require('fs')
const Rx = require('rx')

exports.removeFile = (x) => Rx.Observable.fromCallback(fs.unlink)(x).toPromise()

exports.createFileDigest = (path) => {
  const hash = crypto.createHash('sha1')
  return new Promise((resolve) => fs
    .createReadStream(path)
    .on('data', (x) => hash.update(x))
    .on('end', () => resolve(hash.digest('hex').toUpperCase()))
  )
}

exports.fsStat = (x) => Rx.Observable.fromCallback(fs.stat)(x).toPromise()

exports.createTestObserver = (stream) => {
  const out = []
  stream.subscribe((x) => out.push(x))
  return out
}
