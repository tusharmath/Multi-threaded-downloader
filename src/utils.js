/**
 * Created by tushar.mathur on 22/01/16.
 */

'use strict'

import _ from 'lodash'
import PATH from 'path'
import URL from 'url'

export const toBuffer = function (obj, size) {
  var buffer = createEmptyBuffer(size)
  buffer.write(JSON.stringify(obj))
  return buffer
}

export const selectAs = function () {
  const keys = _.toArray(arguments)
  return function () {
    const values = _.toArray(arguments)
    const merge = (m, k, i) => (m[k] = values[i])
    return _.transform(keys, merge, {})
  }
}

export const log = function () {
  return console.log.apply(console, _.toArray(arguments))
}

export const createEmptyBuffer = function (size) {
  var buffer = new Buffer(size || 512)
  buffer.fill(' ')
  return buffer
}
export const normalizePath = (path) => PATH.resolve(process.cwd(), path)
export const fileNameGenerator = (x) => _.last(URL.parse(x).pathname.split('/')) || Date.now()
export const pathGenerator = (x) => normalizePath(fileNameGenerator(x))
