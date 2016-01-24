/**
 * Created by tushar.mathur on 22/01/16.
 */

'use strict'

const _ = require('lodash')

const e = exports
e.toBuffer = function (obj, size) {
  var buffer = e.createEmptyBuffer(size)
  buffer.write(JSON.stringify(obj))
  return buffer
}

e.selectAs = function () {
  const keys = _.toArray(arguments)
  return function () {
    const values = _.toArray(arguments)
    const merge = (m, k, i) => m[k] = values[i]
    return _.transform(keys, merge, {})
  }
}

e.log = function () {
  return console.log.apply(console, _.toArray(arguments))
}

e.createEmptyBuffer = function (size) {
  var buffer = new Buffer(size || 512)
  _.fill(buffer, null)
  return buffer
}
