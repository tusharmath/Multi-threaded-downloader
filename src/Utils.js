/**
 * Created by tushar.mathur on 22/01/16.
 */

'use strict'

import _ from 'lodash'
import PATH from 'path'
import URL from 'url'
import Rx from 'rx'
import * as u from './Utils'
import {create} from 'reactive-storage'
import Immutable from 'immutable'
import {MTDError, FILE_SIZE_UNKNOWN} from './Error'
import * as ob from './Transformers'

const PROPS = ['range', 'url', 'totalBytes', 'threads', 'offsets', 'strictSSL']

export const initialize = (ob, options) => ob
  .requestContentLength(options)
  .map((totalBytes) => {
    if (!_.isFinite(totalBytes)) throw new MTDError(FILE_SIZE_UNKNOWN)
    const threads = u.splitRange(totalBytes, options.range)
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
export const rangeHeader = (range) => ({range: `bytes=${range[0]}-${range[1]}`})
export const bufferOffset = (buffer, offset) => {
  if (typeof offset !== 'number') {
    offset = 0
  }
  return buffer
    .map((buffer) => ({buffer, offset}))
    .tap((x) => (offset += x.buffer.length))
}
export const splitRange = (totalBytes, range) => {
  const delta = Math.round(totalBytes / range)
  const start = _.times(range, (x) => x * delta)
  const end = _.times(range, (x) => (x + 1) * delta - 1)
  end[range - 1] = totalBytes
  return _.zip(start, end)
}
export const createFD = _.curry((ob, path, flag) => ob.fsOpen(path, flag))
export const bufferSave = (ob, fileDescriptor, content) => {
  return content
    .combineLatest(fileDescriptor, (content, fd) => _.assign(content, {fd}))
    .flatMap((x) => ob.fsWriteBuffer(x).map(x))
}
export const contentLoad = (ob, metaStream) => metaStream
  .flatMap((meta) => meta.threads.map((range, index) => ({range, meta, index})))
  .map((x) => {
    const offset = x.meta.offsets[x.index]
    const range = rangeHeader([offset, x.range[1]])
    const params = _.omit(x.meta, 'threads', 'offsets')
    params.headers = _.assign({}, params.headers, range)
    return {params, range: x.range, index: x.index, offset}
  })
  .flatMap((x) => bufferOffset(ob.requestBody(x.params)
    .filter((x) => x.event === 'data')
    .pluck('message'), x.offset)
    .map((i) => _.assign({}, i, {range: x.range, index: x.index}))
  )

export const defaultOptions = {range: 3}
export const initParams = (options) => _.defaults(
  options,
  defaultOptions,
  {mtdPath: options.path + '.mtd'}
)

export const downloadMTD = (ob, fd) => {
  const offsets = create(Immutable.List([]))
  const loadedMETA = load(fd)
    .tap((x) => offsets.set((i) => i.merge(x.offsets)))
  const loadedContent = contentLoad(ob, loadedMETA)
  const savedContent = bufferSave(ob, fd, loadedContent)
    .tap((x) => offsets.set((i) => i.set(x.index, x.offset)))
  const currentMETA = update(loadedMETA, savedContent, offsets.stream)
  return save(ob, fd, currentMETA)
}
