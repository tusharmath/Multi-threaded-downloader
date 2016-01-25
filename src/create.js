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
 * @param {Observable} createJSON
 * @returns {Observable}
 */
// TODO: Add unit tests
exports.create = (ob, fileDescriptor, createJSON) => {
  const offset = createJSON.pluck('totalBytes')
  return Rx.Observable.zip(
    fileDescriptor,
    createJSON,
    offset,
    u.selectAs('fd', 'json', 'offset')
  ).flatMap(ob.fsWriteJSON)
}
