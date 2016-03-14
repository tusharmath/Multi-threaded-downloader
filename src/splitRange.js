/**
 * Created by tushar.mathur on 26/01/16.
 */

'use strict'
const _ = require('lodash')

module.exports = (totalBytes, range) => {
  const delta = Math.round(totalBytes / range)
  const start = _.times(range, (x) => x * delta)
  const end = _.times(range, (x) => (x + 1) * delta - 1)
  end[range - 1] = totalBytes
  return _.zip(start, end)
}

