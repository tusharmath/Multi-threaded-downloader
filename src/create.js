/**
 * Created by tushar.mathur on 22/01/16.
 */

'use strict'

const Rx = require('rx')
const _ = require('lodash')
const u = require('./utils')
const ob = require('./observables')

exports.create = (options) => {
  const path = options.mtdPath
  const fileDescriptor = ob.fsOpen(path, 'w')
  const response = ob.requestBody(_.assign({}, options, {method: 'HEAD'}))
  const offset = response.pluck('message', 'headers', 'content-length').map(x => parseInt(x, 10))
  const buffer = offset
    .map(x => _.assign({}, options, {totalBytes: x}))
    .map(x => u.toBuffer(x, options.maxBuffer))

  return Rx.Observable.zip(
    fileDescriptor,
    buffer,
    offset,
    u.selectAs('fd', 'buffer', 'offset')
  ).flatMap(ob.fsWriteBuffer)
}
