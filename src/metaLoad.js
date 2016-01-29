/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'
const Rx = require('rx')
const ob = require('./observables')
const u = require('./utils')

module.exports = fileDescriptor => {
  const contentLength = fileDescriptor.flatMap(x => ob.fsStat(x)).pluck('size').map(x => x - 512)
  return Rx.Observable.combineLatest(
    contentLength,
    fileDescriptor,
    ob.buffer(512),
    u.selectAs('offset', 'fd', 'buffer'))
    .flatMap(ob.fsReadJSON)
}
