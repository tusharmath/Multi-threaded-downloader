/**
 * Created by tushar.mathur on 04/06/16.
 */

'use strict'
import _ from 'lodash'
import Rx from 'rx'
import {MTDError, FILE_SIZE_UNKNOWN} from './errors'
import splitRange from './splitRange'
import * as ob from './Transformers'
import * as u from './utils'

const PROPS = ['range', 'url', 'totalBytes', 'threads', 'offsets', 'strictSSL']

export const initialize = (ob, options) => ob
  .requestContentLength(options)
  .map((totalBytes) => {
    if (!_.isFinite(totalBytes)) throw new MTDError(FILE_SIZE_UNKNOWN)
    const threads = splitRange(totalBytes, options.range)
    return _.assign({}, options, {totalBytes, threads, offsets: threads.map((x) => x[0])})
  })
  .map((x) => _.pick(x, PROPS))

export const load = (fileDescriptor) => {
  const contentLength = fileDescriptor.flatMap((x) => ob.fsStat(x)).pluck('size').map((x) => x - 512)
  return Rx.Observable.combineLatest(
    contentLength,
    fileDescriptor,
    ob.buffer(512),
    u.selectAs('offset', 'fd', 'buffer'))
    .flatMap(ob.fsReadJSON)
}

export const save = (ob, fileDescriptor, metaJSON) => metaJSON
  .combineLatest(fileDescriptor, u.selectAs('json', 'fd'))
  .map((x) => _.assign(x, {offset: x.json.totalBytes}))
  .flatMap(ob.fsWriteJSON)
  .map((x) => JSON.parse(x[1].toString()))

export const update = (baseMeta, bytesSaved, offsets) => bytesSaved
  .withLatestFrom(baseMeta, offsets, u.selectAs('content', 'meta', 'offsets'))
  .map((x) => _.assign({}, x.meta, {offsets: x.offsets.toJS()}))
  .distinctUntilChanged()
