/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'
const bufferOffset = require('./bufferOffset')
const rangeHeader = require('./rangeHeader')
const _ = require('lodash')

module.exports = (ob, metaStream) => metaStream
  .flatMap((meta) => meta.threads.map((range, index) => ({range, meta, index})))
  .map((x) => {
    const offset = x.meta.offsets[x.index]
    const range = rangeHeader([offset, x.range[1]])
    const params = _.omit(x.meta, 'threads', 'offsets')
    params.headers = _.assign({}, params.headers, range)
    return {params, range: x.range, index: x.index, offset}
  })
  .flatMap((x) => bufferOffset(ob.requestBody(x.params)
    .filter((x) => x.event === 'data')
    .pluck('message'), x.offset)
    .map((i) => _.assign({}, i, {range: x.range, index: x.index}))
  )
