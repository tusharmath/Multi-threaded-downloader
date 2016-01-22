/**
 * Created by tushar.mathur on 22/01/16.
 */

'use strict'

const _ = require('lodash')

exports.toBuffer = function (obj, size) {
  var buffer = new Buffer(size)
  _.fill(buffer, null)
  buffer.write(JSON.stringify(obj))
  return buffer
}

exports.selectAs = function () {
  const keys = _.toArray(arguments)
  return function () {
    const values = _.toArray(arguments)
    const merge = (m, k, i) => m[k] = values[i]
    return _.transform(keys, merge, {})
  }
}

exports.log = function () {
  console.log.apply(console, _.toArray(arguments))
}

