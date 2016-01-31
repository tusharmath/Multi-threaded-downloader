'use strict'

const _ = require('lodash')
const splitRange = require('./splitRange')
const PROPS = [
  'range', 'url', 'totalBytes', 'threads', 'offsets', 'strictSSL'
]
module.exports = (ob, options) => ob
    .requestContentLength(options)
    .map(x => {
      const threads = splitRange(x, options.range)
      return _.assign({}, options, {totalBytes: x, threads, offsets: threads.map(x => x[0])})
    })
    .map(x => _.pick(x, PROPS))
