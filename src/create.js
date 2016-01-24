/**
 * Created by tushar.mathur on 22/01/16.
 */

'use strict'

const Rx = require('rx')
const u = require('./utils')


/**
 * Creates the initial .mtd file.
 * @param {Object} ob
 * @param {Observable} fileDescriptor
 * @param {Observable} createMeta
 * @returns {Observable}
 */
// TODO: Add unit tests
exports.create = (ob, fileDescriptor, createMeta) => {
  const buffer = createMeta.map(x => u.toBuffer(x))
  const offset = createMeta.pluck('totalBytes')
  return Rx.Observable.zip(
    fileDescriptor,
    buffer,
    offset,
    u.selectAs('fd', 'buffer', 'offset')
  ).flatMap(ob.fsWriteBuffer)
}
