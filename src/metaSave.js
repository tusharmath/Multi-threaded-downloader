/**
 * Created by tushar.mathur on 22/01/16.
 */

'use strict'

const _ = require('lodash')
const u = require('./utils')

/**
 * Creates the initial .mtd file.
 * @param {Object} ob
 * @param {Observable} fileDescriptor
 * @param {Observable} metaJSON
 * @returns {Observable}
 */
module.exports = (ob, fileDescriptor, metaJSON) => metaJSON
  .combineLatest(fileDescriptor, u.selectAs('json', 'fd'))
  .map((x) => _.assign(x, {offset: x.json.totalBytes}))
  .flatMap(ob.fsWriteJSON)
  .map((x) => JSON.parse(x[1].toString()))

