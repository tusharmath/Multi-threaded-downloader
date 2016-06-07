/**
 * Created by tushar.mathur on 22/01/16.
 */

'use strict'

import PATH from 'path'
import URL from 'url'
import Rx from 'rx'
import R from 'ramda'
import {MTDError, FILE_SIZE_UNKNOWN} from './Error'

const O = Rx.Observable
const PROPS = ['range', 'url', 'totalBytes', 'threads', 'offsets', 'strictSSL']
const BUFFER_SIZE = 512
export const zipUnApply = R.compose(R.unapply, R.zipObj)
export const normalizePath = (path) => PATH.resolve(process.cwd(), path)
export const fileNameGenerator = (x) => R.last(URL.parse(x).pathname.split('/')) || Date.now()
export const pathGenerator = (x) => normalizePath(fileNameGenerator(x))
export const rangeHeader = (range) => ({range: `bytes=${range[0]}-${range[1]}`})
export const splitRange = (totalBytes, range) => {
  const delta = Math.round(totalBytes / range)
  const start = R.times((x) => x * delta, range)
  const end = R.times((x) => (x + 1) * delta - 1, range)
  end[range - 1] = totalBytes
  return R.zip(start, end)
}

export const updateMetaOffsets = ({meta, offsets}) => R.mergeAll([meta, {offsets}])
export const accBuffOffsets = (m, buffer) => ({buffer, offset: m.offset + m.buffer.length})
export const requestParams = ({meta, index, range}) => {
  const offset = meta.offsets[index]
  const requestParams = R.omit(['threads', 'offsets'], meta)
  requestParams.headers = R.mergeAll([requestParams.headers, rangeHeader([offset, range[1]])])
  return requestParams
}

/*
 * STREAM BASED
 */
export const InitialMeta = ({totalBytes, threads, options}) => {
  const others = {totalBytes, threads, offsets: threads.map(R.nth(0))}
  return R.pick(PROPS, R.mergeAll([{}, options, others]))
}
export const RemoteFileSize = ({HTTP, options}) => HTTP.requestContentLength(options)
export const CreateDownloadMeta = ({HTTP, options}) => {
  const size$ = RemoteFileSize({HTTP, options})
  return size$
    .map((totalBytes) => {
      if (!isFinite(totalBytes)) throw new MTDError(FILE_SIZE_UNKNOWN)
      const threads = splitRange(totalBytes, options.range)
      return InitialMeta({options, threads, totalBytes})
    })
}
export const FileSize = ({FILE, fd$}) => {
  const stats = R.compose(FILE.fsStat, R.nthArg(0))
  return fd$.flatMap(stats).pluck('size')
}
export const LoadMeta = ({FILE, fd$}) => {
  const size$ = FileSize({FILE, fd$})
  const offset$ = size$.map(R.add(-BUFFER_SIZE))
  return O.combineLatest(offset$, fd$, FILE.buffer(BUFFER_SIZE), zipUnApply(['offset', 'fd', 'buffer']))
    .flatMap(FILE.fsReadJSON)
}
export const SaveMeta = ({FILE, fd$, meta$}) => O
  .combineLatest(meta$, fd$, zipUnApply(['json', 'fd']))
  .map((x) => R.mergeAll([x, {offset: x.json.totalBytes}]))
  .flatMap(FILE.fsWriteJSON)
  .map((x) => JSON.parse(x[1].toString()))
export const UpdateMeta = ({meta$, bytesSaved$}) => bytesSaved$
  .withLatestFrom(meta$, zipUnApply(['offsets', 'meta']))
  .map(updateMetaOffsets)
  .distinctUntilChanged()
export const BufferOffset = ({buffer$, offset}) => buffer$.scan(accBuffOffsets, {offset, buffer: {length: 0}})
export const SaveBuffer = ({FILE, fd$, buffer$}) => buffer$
  .combineLatest(fd$, (content, fd) => R.mergeAll([content, {fd}]))
  .flatMap((x) => FILE.fsWriteBuffer(x).map(x))
export const BufferThread = ({buffer$, offset, range, index}) => BufferOffset({buffer$, offset})
  .map((i) => R.mergeAll([i, {range, index}]))
export const ContentLoad = ({HTTP, meta$}) => {
  const Buffer$ = R.compose(HTTP.select('data'), HTTP.requestBody, requestParams)
  const sliceThreads = (meta) => meta.threads.map((range, index) => ({range, meta, index}))
  return meta$
    .flatMap(sliceThreads)
    .flatMap(({meta, index, range}) => {
      const buffer$ = Buffer$({meta, index, range})
      const offset = meta.offsets[index]
      return BufferThread({buffer$, offset, range, index})
    })
}

export const mergeDefaultOptions = (options) => R.mergeAll([
  {mtdPath: options.path + '.mtd', range: 3},
  options
])

export const resumeFromMTDFile = ({FILE, HTTP, options}) => {
  const fd$ = FILE.fsOpen(options.mtdPath, 'r+')
  const meta$ = LoadMeta({FILE, fd$})
  const loadedOffsets$ = meta$.pluck('offsets')
  const buffer$ = ContentLoad({HTTP, meta$})
  const saveBuffer$ = SaveBuffer({FILE, fd$, buffer$})
  const bytesSaved$ = saveBuffer$.map(R.pick(['offset', 'index']))
    .withLatestFrom(loadedOffsets$)
    .scan((previous, current) => {
      const {index, offset} = R.nth(0, current)
      const offsets = R.set(R.lensIndex(index), offset, R.nth(1, previous))
      return [current, offsets]
    })
    .map(R.nth(1))

  const nMeta$ = UpdateMeta({meta$, bytesSaved$})
  return SaveMeta({FILE, fd$, meta$: nMeta$})
}
export const createMTDFile = ({FILE, HTTP, options}) => {
  const fd$ = FILE.fsOpen(options.mtdPath, 'w')
  const meta$ = CreateDownloadMeta({HTTP, options})
  return SaveMeta({FILE, fd$, meta$})
}
