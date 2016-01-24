/**
 * Created by tushar.mathur on 22/01/16.
 */

'use strict'

const Rx = require('rx')
const _ = require('lodash')
const u = require('./utils')

// TODO: Add unit tests
exports.create = (ob, options) => {
  const path = options.mtdPath
  const fileDescriptor = ob.fsOpen(path, 'w')
  const response = ob.requestBody(_.assign({}, options, {method: 'HEAD'}))
  const offset = response.pluck('message', 'headers', 'content-length').map(x => parseInt(x, 10))
  const meta = offset.map(x => _.assign({}, options, {totalBytes: x}))
  const buffer = meta.map(x => u.toBuffer(x, options.maxBuffer))

  return Rx.Observable.zip(
    fileDescriptor,
    buffer,
    offset,
    u.selectAs('fd', 'buffer', 'offset')
  ).flatMap(ob.fsWriteBuffer)
    // TODO: add tests
    .withLatestFrom(meta, (a, b) => b)
}
