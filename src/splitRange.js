/**
 * Created by tushar.mathur on 26/01/16.
 */

'use strict'
const _ = require('lodash')

module.exports = (range, count) => {
  const delta = Math.round(range / count)
  const start = _.times(count, (x) => x * delta)
  const end = _.times(count, (x) => (x + 1) * delta - 1)
  end[count - 1] = range
  return _.zip(start, end)
}

