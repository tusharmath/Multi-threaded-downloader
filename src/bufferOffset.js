/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

export default (buffer, offset) => {
  if (typeof offset !== 'number') {
    offset = 0
  }
  return buffer
    .map((buffer) => ({buffer, offset}))
    .tap((x) => (offset += x.buffer.length))
}
