/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

const _ = require('lodash')
const metaSave = require('./metaSave')
const splitRange = require('./splitRange')

module.exports = (ob, fd, options) => {
  const totalBytes = ob.requestContentLength(options)
  const initialMETA = totalBytes.map(x => {
    const threads = splitRange(x, options.range)
    return _.assign({}, options, {totalBytes: x, threads, offsets: threads.map(x => x[0])})
  })
  return metaSave(ob, fd, initialMETA)
}
