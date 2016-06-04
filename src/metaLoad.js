/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'
import Rx from 'rx'
import * as ob from './Transformers'
import * as u from './utils'

export default (fileDescriptor) => {
  const contentLength = fileDescriptor.flatMap((x) => ob.fsStat(x)).pluck('size').map((x) => x - 512)
  return Rx.Observable.combineLatest(
    contentLength,
    fileDescriptor,
    ob.buffer(512),
    u.selectAs('offset', 'fd', 'buffer'))
    .flatMap(ob.fsReadJSON)
}
