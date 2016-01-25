/**
 * Created by tushar.mathur on 20/01/16.
 */

'use strict'
const _ = require('lodash')

module.exports = function (ob, fileDescriptor, content) {
  return content
    .combineLatest(fileDescriptor, (content, fd) => _.assign(content, {fd}))
    .flatMap(ob.fsWriteBuffer)
    .map(x => x[1])
}
