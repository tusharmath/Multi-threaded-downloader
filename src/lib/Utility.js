/**
 * Created by tusharmathur on 7/14/15.
 */
var _ = require('lodash')
var utility = {}
var {Set} = require('Immutable')

utility.toBuffer = function (obj, size) {
  var buffer = new Buffer(size)
  _.fill(buffer, null)
  buffer.write(JSON.stringify(obj))
  return buffer
}

utility.sliceRange = function (count, total) {
  var bytesPerThread = _.round(total / count)
  return _.times(count, function (index) {
    var start = bytesPerThread * index,
      end = count - index === 1 ? total : start + bytesPerThread - 1
    return {start, end}
  })
}

utility.keyIn = _.curry((keys, v, k) => Set(keys).has(k))

module.exports = utility
