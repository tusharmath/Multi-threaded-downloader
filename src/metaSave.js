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
module.exports = (ob, fileDescriptor, metaJSON) => {
  const offset = metaJSON.pluck('totalBytes')
  return metaJSON.withLatestFrom(fileDescriptor, offset, u.selectAs('json', 'fd', 'offset'))
    .flatMap(ob.fsWriteJSON)
    .map(x => JSON.parse(x[1].toString()))
}
