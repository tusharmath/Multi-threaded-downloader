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
 * @param {Observable} metaJSON
 * @returns {Observable}
 */
// TODO: Add unit tests
module.exports = (ob, fileDescriptor, metaJSON) => {
  const offset = metaJSON.pluck('totalBytes')
  return Rx.Observable.zip(
    fileDescriptor,
    metaJSON,
    offset,
    u.selectAs('fd', 'json', 'offset')
  ).flatMap(ob.fsWriteJSON)
}
