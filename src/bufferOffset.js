/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

module.exports = buffer => {
  var offset = 0
  return buffer
    .map(buffer => ({buffer, offset}))
    .tap(x => offset += x.buffer.length)
}
