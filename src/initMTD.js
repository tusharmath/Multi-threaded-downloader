/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

const _ = require('lodash')
const metaSave = require('./metaSave')

module.exports = (ob, fd, options) => {
  const contentLength = ob.requestContentLength(options)
  const initialMETA = contentLength.map(x => _.assign({}, options, {totalBytes: x}))
  return metaSave(ob, fd, initialMETA)
}
