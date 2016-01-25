/**
 * Created by tushar.mathur on 20/01/16.
 */

'use strict'
const _ = require('lodash')
const loadContent = require('./loadContent')
const bufferOffset = require('./bufferOffset')
const metaUpdate = require('./metaUpdate')

module.exports = function (ob, createMETA, fileDescriptor) {
  const writeBuffer = loadContent(ob, createMETA)
    .combineLatest(fileDescriptor, (content, fd) => _.assign(content, {fd}))
    .flatMap(ob.fsWriteBuffer).map(x => x[1])

  return metaUpdate(createMETA, bufferOffset(writeBuffer).pluck('offset'))
}
