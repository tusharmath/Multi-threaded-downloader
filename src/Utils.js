/**
 * Created by tushar.mathur on 22/01/16.
 */

'use strict'

import PATH from 'path'
import URL from 'url'
import {Observable as O} from 'rx'
import R from 'ramda'
import * as Rx from './RxFP'
import {mux, demux} from 'muxer'
import {MTDError, FILE_SIZE_UNKNOWN} from './Error'

const first = R.nth(0)
const second = R.nth(1)
export const trace = R.curry((msg, value) => {
  console.log(msg, value)
  return value
})
export const BUFFER_SIZE = 512
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
export const CreateRangeHeader = ([start, end]) => `bytes=${start}-${end}`
export const SetRangeHeader = ({request, range}) => {
  return R.set(
    R.lensPath(['headers', 'range']),
    CreateRangeHeader(range),
    R.omit(['threads', 'offsets'], request)
  )
}
export const CreateRequestParams = ({meta, index}) => {
  const range = [meta.offsets[index], second(meta.threads[index])]
  return SetRangeHeader({request: meta, range})
}
export const ToBuffer = R.curry((size, str) => {
  var buffer = CreateFilledBuffer(size)
  buffer.write(str)
  return buffer
})
export const CreateFilledBuffer = (size = BUFFER_SIZE, fill = ' ') => {
  const buffer = new Buffer(size)
  buffer.fill(fill)
  return buffer
}
export const MergeDefaultOptions = (options) => R.mergeAll([
  {mtdPath: options.path + '.mtd', range: 3, metaWrite: 300},
  options
])
/*
 * STREAM BASED
 */
export const RequestDataOffset = ({HTTP, requestParams, offset}) => {
  const [{data$, response$}] = demux(HTTP.request(requestParams), 'data$', 'response$')
  const accumulator = ([_buffer, _offset], buffer) => [buffer, _buffer.length + _offset]
  const buffer$ = data$.scan(accumulator, [{length: 0}, offset])
  return mux({buffer$, response$})
}
export const ToJSON$ = source$ => source$.map(JSON.stringify.bind(JSON))
export const ToBuffer$ = source$ => source$.map(ToBuffer(BUFFER_SIZE))
export const JSToBuffer$ = R.compose(ToBuffer$, ToJSON$)
export const BufferToJS$ = buffer$ => buffer$.map(buffer => JSON.parse(buffer.toString()))
export const RemoteFileSize$ = ({HTTP, options}) => {
  return HTTP.requestHead(options)
    .pluck('headers', 'content-length')
    .map((x) => parseInt(x, 10))
}
export const LocalFileSize$ = ({FILE, fd$}) => FILE.fstat(fd$.map(R.of)).pluck('size')
export const PickFirst = R.map(first)
export const CreateMeta$ = ({size$, options}) => {
  return size$.map((totalBytes) => {
    if (!isFinite(totalBytes)) throw new MTDError(FILE_SIZE_UNKNOWN)
    const threads = SplitRange(totalBytes, options.range)
    return R.merge(options, {totalBytes, threads, offsets: PickFirst(threads)})
  })
}
export const ReadFileAt$ = ({FILE, fd$, position$, size = BUFFER_SIZE}) => {
  const readParams$ = O.combineLatest(position$, fd$)
  const buffer = CreateFilledBuffer(size)
  const toParam = ([position, fd]) => [fd, buffer, 0, buffer.length, position]
  return FILE.read(readParams$.map(toParam))
}
export const MetaPosition$ = ({size$}) => size$.map(R.add(-BUFFER_SIZE))
export const CreateWriteBufferAtParams = ({fd$, buffer$, position$}) => {
  const toParam = ([buffer, fd, position]) => [fd, buffer, 0, buffer.length, position]
  return O.combineLatest(buffer$, fd$, position$.first()).map(toParam)
}
export const CreateWriteBufferParams = ({fd$, buffer$, position$}) => {
  const toParams = ([fd, buffer, position]) => [fd, buffer, 0, buffer.length, position]
  return O.combineLatest(fd$, O.zip(buffer$, position$))
    .map(R.compose(toParams, R.unnest))
}
export const AccumulateOffset = ({meta$, written$, thread$}) => {
  const offsetLens = thread => R.compose(R.lensProp('offsets'), R.lensIndex(thread))
  const start$ = meta$.map(meta => ({meta, len: 0, thread: 0})).first()
  const source$ = O.merge(
    start$,
    O.zip(written$, thread$)
      .map(R.zipObj(['len', 'thread']))
      .withLatestFrom(meta$.map(R.objOf('meta')))
      .map(R.mergeAll)
  )

  const accumulator = (previous, current) => {
    const thread = current.thread
    const pMeta = previous.meta
    const oldVal = pMeta.offsets[thread]
    const lens = offsetLens(thread)
    const meta = R.set(lens, R.add(oldVal, current.len), pMeta)
    return R.merge(current, {meta})
  }

  return source$
    .scan(accumulator)
    .skip(1)
    .pluck('meta')
}
export const ReadJSON$ = R.compose(BufferToJS$, Rx.map(second), ReadFileAt$)
export const CreateRequestParamsWithOffset = ({meta$, CreateRequestParams}) => {
  const MetaOffset = ({meta, index}) => meta.offsets[index]
  const addIndex = (meta) => meta.threads.map((_, index) => ({meta, index}))
  const Params = R.applySpec({
    thread: R.prop('index'),
    offset: MetaOffset,
    requestParams: CreateRequestParams
  })
  return Rx.flatMap(addIndex, meta$).map(Params)
}
export const RxFlatMapReplay = R.curryN(2, R.compose(Rx.shareReplay(1), Rx.flatMap))
export const RxThrottleComplete = (window$, $, sh) => {
  const selector = window => O.merge($.throttle(window, sh), $.last())
  return window$.first().flatMap(selector)
}
export const RemoveMETA = ({FILE, meta$, fd$}) => {
  const size$ = meta$.pluck('totalBytes')
  return FILE.truncate(O.combineLatest(fd$, size$).take(1))
}
export const ResetFileName = ({FILE, meta$}) => {
  const params$ = meta$.map(meta => [meta.mtdPath, meta.path]).take(1)
  return FILE.rename(params$)
}
export const IsCompleted$ = ({meta$}) => {
  const equals = R.apply(R.equals)
  const offsetsA = R.prop('offsets')
  const offsetsB = R.compose(R.map(second), R.prop('threads'))
  const isComplete = R.compose(equals, R.ap([offsetsA, offsetsB]), R.of)
  return meta$.map(isComplete).distinctUntilChanged()
}
export const FinalizeDownload = ({FILE, fd$, meta$}) => {
  const metaRemoved$ = RemoveMETA({FILE, meta$, fd$})
  const renamed$ = metaRemoved$.flatMap(() => ResetFileName({FILE, meta$}))
  return mux({metaRemoved$, renamed$})
}
export const DownloadFromMTDFile = ({FILE, HTTP, mtdPath}) => {
  /**
   * Create Request function
   */
  const HttpRequestReplay = RxFlatMapReplay(R.compose(RequestDataOffset, R.merge({HTTP})))

  /**
   * Open file to read+append
   */
  const fd$ = FILE.open(O.just([mtdPath, 'r+']))

  /**
   * Retrieve File size on disk
   */
  const size$ = LocalFileSize$({FILE, fd$})

  /**
   * Retrieve Meta info
   */
  const metaPosition$ = MetaPosition$({size$})
  const meta$ = ReadJSON$({FILE, fd$, position$: metaPosition$})

  /**
   * Create request params and make HTTP requests
   */
  const request$ = CreateRequestParamsWithOffset({meta$, CreateRequestParams})

  /**
   * Receive response stream
   */
  const [{response$, buffer$}] = demux(HttpRequestReplay(request$), 'buffer$', 'response$')

  /**
   * Create write params and save buffer+offset to disk
   */
  const saveBuffer$ = FILE.write(CreateWriteBufferParams({
    FILE,
    fd$,
    buffer$: buffer$.map(first),
    position$: buffer$.map(second)
  }))

  /**
   * Update META info
   */
  const nMeta$ = AccumulateOffset({meta$, written$: saveBuffer$.map(first), thread$: buffer$.map(second)})

  /**
   * Persist META to disk
   */
  const metaWritten$ = FILE.write(CreateWriteBufferAtParams({
    fd$,
    buffer$: JSToBuffer$(RxThrottleComplete(meta$.pluck('metaWrite'), nMeta$)),
    position$: size$
  }))
  return mux({
    metaWritten$, localFileSize$: size$, fdR$: fd$, metaPosition$,
    meta$: O.merge(nMeta$, meta$),
    response$,
    completed$: IsCompleted$({meta$})
  })
}
export const CreateMTDFile = ({FILE, HTTP, options}) => {
  /**
   * Create a new file
   */
  const fd$ = FILE.open(O.just([options.mtdPath, 'w']))

  /**
   * Retreive file size on remote server
   */
  const size$ = RemoteFileSize$({HTTP, options})

  /**
   * Create initial meta data
   */
  const meta$ = CreateMeta$({options, size$})

  /**
   * Create a new file with meta info appended at the end
   */
  const written$ = FILE.write(CreateWriteBufferAtParams({
    FILE,
    fd$: fd$,
    buffer$: JSToBuffer$(meta$),
    position$: size$
  }))
  return mux({written$, meta$, remoteFileSize$: size$, fdW$: fd$})
}
