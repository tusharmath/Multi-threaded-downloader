/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

module.exports = (ob, meta) => {
  var offset = 0
  return ob.requestBody(meta).filter(x => x.event === 'data').pluck('message')
    .map(buffer => ({offset, buffer}))
    .tap(x => offset += x.buffer.length)
    .share()
}
