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
const BUFFER_SIZE = 512
const first = R.nth(0)
const second = R.nth(1)
export const zipUnApply = R.compose(R.unapply, R.zipObj)
export const NormalizePath = (path) => PATH.resolve(process.cwd(), path)
export const GenerateFileName = (x) => R.last(URL.parse(x).pathname.split('/')) || Date.now()
export const ResolvePath = R.compose(NormalizePath, GenerateFileName)
export const SplitRange = (totalBytes, range) => {
  const delta = Math.round(totalBytes / range)
  const start = R.times((x) => x * delta, range)
  const end = R.times((x) => (x + 1) * delta - 1, range)
  end[range - 1] = totalBytes
  return R.zip(start, end)
}
export const CreateRequestParams = ({meta, index}) => {
  const offset = meta.offsets[index]
  const range = meta.threads[index]
  return R.set(
    R.lensPath(['headers', 'range']),
    `bytes=${offset}-${second(range)}`,
    R.omit(['threads', 'offsets'], meta)
  )
}

/*
 * STREAM BASED
 */

export const RemoteFileSize = ({HTTP, options}) => HTTP.requestHead(options)
  .pluck('headers', 'content-length')
  .map((x) => parseInt(x, 10))
export const LocalFileSize = ({FILE, fd$}) => {
  const stats = R.compose(FILE.fsStat, R.nthArg(0))
  return fd$.flatMap(stats).pluck('size')
}
export const CreateMeta = ({size$, options}) => {
  const mergeDefault = R.compose(
    R.pick(['range', 'url', 'totalBytes', 'threads', 'offsets', 'strictSSL']),
    R.merge(options)
  )
  return size$.map((totalBytes) => {
    if (!isFinite(totalBytes)) throw new MTDError(FILE_SIZE_UNKNOWN)
    const threads = SplitRange(totalBytes, options.range)
    return mergeDefault({totalBytes, threads, offsets: threads.map(first)})
  })
}
export const LoadMeta = ({FILE, fd$}) => {
  const size$ = LocalFileSize({FILE, fd$})
  const offset$ = size$.map(R.add(-BUFFER_SIZE))
  return O.combineLatest(offset$, fd$, FILE.buffer(BUFFER_SIZE), zipUnApply(['offset', 'fd', 'buffer']))
    .flatMap(FILE.fsReadJSON)
}
export const SaveMeta = ({FILE, fd$, meta$}) => O
  .combineLatest(meta$, fd$, zipUnApply(['json', 'fd']))
  .map((x) => R.mergeAll([x, {offset: x.json.totalBytes}]))
  .flatMap(FILE.fsWriteJSON)
  .map((x) => JSON.parse(x[1].toString()))
export const UpdateMeta = ({meta$, bytesSaved$}) => {
  const updateMetaOffsets = ({meta, offsets}) => R.mergeAll([meta, {offsets}])
  return bytesSaved$
    .withLatestFrom(meta$, zipUnApply(['offsets', 'meta']))
    .map(updateMetaOffsets)
    .distinctUntilChanged()
}
export const BufferOffset = ({buffer$, offset}) => {
  const accBuffOffsets = (m, buffer) => ({buffer, offset: m.offset + m.buffer.length})
  return buffer$.scan(accBuffOffsets, {offset, buffer: {length: 0}})
}
export const SaveBuffer = ({FILE, fd$, buffer$}) => buffer$
  .combineLatest(fd$, (content, fd) => R.mergeAll([content, {fd}]))
  .flatMap((x) => FILE.fsWriteBuffer(x).map(x))
export const BufferThread = ({buffer$, offset, range, index}) => BufferOffset({buffer$, offset})
  .map((i) => R.mergeAll([i, {range, index}]))
export const ContentLoad = ({HTTP, meta$}) => {
  const Buffer$ = R.compose(HTTP.select('data'), HTTP.requestBody, CreateRequestParams)
  const sliceThreads = (meta) => meta.threads.map((range, index) => ({range, meta, index}))
  return meta$
    .flatMap(sliceThreads)
    .flatMap(({meta, index}) => {
      const range = meta.threads[index]
      const buffer$ = Buffer$({meta, index})
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
      const {index, offset} = first(current)
      const offsets = R.set(R.lensIndex(index), offset, second(previous))
      return [current, offsets]
    })
    .map(second)

  const nMeta$ = UpdateMeta({meta$, bytesSaved$})
  return SaveMeta({FILE, fd$, meta$: nMeta$})
}
export const createMTDFile = ({FILE, HTTP, options}) => {
  const fd$ = FILE.fsOpen(options.mtdPath, 'w')
  const size$ = RemoteFileSize({HTTP, options})
  const meta$ = CreateMeta({options, size$})
  return SaveMeta({FILE, fd$, meta$})
}
