'use strict'

import _ from 'lodash'
import {MTDError, FILE_SIZE_UNKNOWN} from './errors'
import splitRange from './splitRange'
const PROPS = [
  'range', 'url', 'totalBytes', 'threads', 'offsets', 'strictSSL'
]
export default (ob, options) => ob
  .requestContentLength(options)
  .map((totalBytes) => {
    if (!_.isFinite(totalBytes)) throw new MTDError(FILE_SIZE_UNKNOWN)
    const threads = splitRange(totalBytes, options.range)
    return _.assign({}, options, {totalBytes, threads, offsets: threads.map((x) => x[0])})
  })
  .map((x) => _.pick(x, PROPS))
