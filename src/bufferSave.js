/**
 * Created by tushar.mathur on 20/01/16.
 */

'use strict'
import _ from 'lodash'

export default function (ob, fileDescriptor, content) {
  return content
    .combineLatest(fileDescriptor, (content, fd) => _.assign(content, {fd}))
    .flatMap((x) => ob.fsWriteBuffer(x).map(x))
}
