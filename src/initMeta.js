'use strict'

const _ = require('lodash')
const splitRange = require('./splitRange')

module.exports = (ob, options) => ob
    .requestContentLength(options)
    .map(x => {
      const threads = splitRange(x, options.range)
      return _.assign({}, options, {totalBytes: x, threads, offsets: threads.map(x => x[0])})
    })
