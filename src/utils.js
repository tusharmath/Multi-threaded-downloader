/**
 * Created by tushar.mathur on 22/01/16.
 */

'use strict'

const _ = require('lodash')
const PATH = require('path')
const URL = require('url')

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
  buffer.fill(' ')
  return buffer
}
e.normalizePath = path => PATH.resolve(process.cwd(), path)
e.fileNameGenerator = x => _.last(URL.parse(x).pathname.split('/')) || Date.now()
e.pathGenerator = x => e.normalizePath(e.fileNameGenerator(x))
