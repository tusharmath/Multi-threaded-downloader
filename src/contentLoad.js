/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'
const bufferOffset = require('./bufferOffset')

module.exports = (ob, meta) => bufferOffset(meta
  .flatMap(ob.requestBody)
  .filter(x => x.event === 'data')
  .pluck('message')
)
