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
export const demuxFP = R.curry((list, $) => demux($, ...list))
export const demuxFPH = R.curry((list, $) => R.head(demux($, ...list)))
export const BUFFER_SIZE = 1024 * 4
export const NormalizePath = (path) => PATH.resolve(process.cwd(), path)
export const GenerateFileName = (x) => {
  return R.last(URL.parse(x).pathname.split('/')) || Date.now()
}
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
export const MTDPath = (path) => path + '.mtd'
export const MergeDefaultOptions = (options) => R.mergeAll([
  {range: 3, metaWrite: 300},
  {mtdPath: MTDPath(R.prop('path', options))},
  options
])

// TODO: Use R.lens instead
export const GetOffset = R.curry((meta, index) => meta.offsets[index])
export const GetThread = R.curry((meta, index) => meta.threads[index])
export const GetThreadStart = R.curryN(2, R.compose(R.nth(0), GetThread))
export const GetThreadEnd = R.curryN(2, R.compose(R.nth(1), GetThread))
export const GetThreadCount = R.compose(R.length, R.prop('threads'))
export const TimesCount = R.times(R.identity)

/*
 * STREAM BASED
 */
export const GetBufferWriteOffset = ({buffer$, initialOffset}) => {
  const accumulator = ([_buffer, _offset], buffer) => [buffer, _buffer.length + _offset]
  return buffer$.scan(accumulator, [{length: 0}, initialOffset])
}
export const SetBufferParams = ({buffer$, index, meta}) => {
  const initialOffset = GetOffset(meta, index)
  const addParams = R.compose(Rx.map(R.append(index)), GetBufferWriteOffset)
  return addParams({buffer$, initialOffset})
}

/**
 * Makes an HTTP request using the {HttpRequest} function and appends the
 * buffer response with appropriate write position and thread index.
 * @function
 * @private
 * @param {Object} HTTP - HTTP transformer
 * @param {function} HTTP.request - HTTP request function
 * @param {Object} r - a dict of meta and selected thread index
 * @param {Object} r.meta - the download meta info
 * @param {Object} r.index - index of the selected thread
 * @returns {Observable} a muxed {buffer$, response$}
 */
export const RequestThread = R.curry((HTTP, {meta, index}) => {
  const pluck = demuxFPH(['data$', 'response$'])
  const HttpRequest = R.compose(HTTP.request, CreateRequestParams)
  const {response$, data$} = pluck(HttpRequest({meta, index}))
  const buffer$ = SetBufferParams({buffer$: data$, meta, index})
  return mux({buffer$, response$})
})
export const ToJSON$ = source$ => source$.map(JSON.stringify.bind(JSON))
export const ToBuffer$ = source$ => source$.map(ToBuffer(BUFFER_SIZE))
export const JSToBuffer$ = R.compose(ToBuffer$, ToJSON$)
export const BufferToJS$ = buffer$ => {
  return buffer$.map(buffer => JSON.parse(buffer.toString()))
}
export const RemoteFileSize$ = ({HTTP, options}) => {
  return HTTP.requestHead(options)
    .pluck('headers', 'content-length')
    .map((x) => parseInt(x, 10))
}
export const LocalFileSize$ = ({FILE, fd$}) => {
  return FILE.fstat(fd$.map(R.of)).pluck('size')
}
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
export const CreateWriteBufferParams = R.compose(
  O.just,
  ([fd, buffer, position]) => [fd, buffer, 0, buffer.length, position],
  R.unnest
)
export const SetMetaOffsets = ({meta$, bufferWritten$}) => {
  const offsetLens = thread => R.compose(R.lensProp('offsets'), R.lensIndex(thread))
  const start$ = meta$.map(meta => ({meta, len: 0, thread: 0})).first()
  const source$ = O.merge(
    start$,
    bufferWritten$.map(x => [x[3], x[2]])
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
export const IsOffsetInRange = R.curry((meta, i) => {
  const start = R.lte(GetThreadStart(meta, i))
  const end = R.gt(GetThreadEnd(meta, i))
  const inRange = R.allPass([start, end])
  return inRange(GetOffset(meta, i))
})
export const FlattenMeta$ = Rx.flatMap((meta) => {
  const MergeMeta = R.map(R.compose(R.merge({meta}), R.objOf('index')))
  const IsValid = R.filter(IsOffsetInRange(meta))
  return MergeMeta(IsValid(TimesCount(GetThreadCount(meta))))
})
export const RxThrottleComplete = (window$, $, sh) => {
  const selector = window => O.merge($.throttle(window, sh), $.last())
  return window$.first().flatMap(selector)
}
export const IsCompleted$ = (meta$) => {
  const offsetsA = R.prop('offsets')
  const offsetsB = R.compose(R.map(second), R.prop('threads'))
  const subtract = R.apply(R.subtract)
  const diff = R.compose(R.all(R.lte(0)), R.map(subtract), R.zip)
  const isComplete = R.converge(diff, [offsetsA, offsetsB])
  return meta$.map(isComplete).distinctUntilChanged()
}
export const TapBetween = R.curry((min, max, value) => {
  return Math.min(max, Math.max(min, value))
})

/**
 * Util method that calculates the total completion percentage (between 0-100).
 * @function
 * @param {Observable} meta$ Meta data stream ie. exposed by {@link DownloadFromMTDFile}
 * @return {external:Observable} Value between 0-100
 */
export const Completion = (meta$) => {
  const tap0To100 = TapBetween(0, 1)
  return meta$.map(meta => {
    const total = meta.totalBytes
    const downloaded = R.sum(meta.offsets) - R.sum(R.map(R.nth(0), meta.threads)) + R.length(meta.threads) - 1
    return tap0To100(Math.ceil(downloaded / total * 100) / 100)
  })
}
export const WriteBuffer = ({FILE, fd$, buffer$}) => {
  const Write = R.compose(FILE.write, CreateWriteBufferParams)
  return O.combineLatest(fd$, buffer$)
    .flatMap(params => {
      return Write(params).map(R.concat(R.nth(1, params)))
    })
}
/**
 * Makes HTTP requests to start downloading data for each thread described in
 * the meta data.
 * @function
 * @private
 * @param {Object} HTTP - an HTTP transformer
 * @param {function} HTTP.request - an HTTP transformer
 * @param {Observable} meta$ - meta data as a stream
 * @returns {Observable} - muxed stream of responses$ and buffer$
 */
export const RequestWithMeta = R.uncurryN(2, (HTTP) => R.compose(
  Rx.flatMap(RequestThread(HTTP)),
  FlattenMeta$
))

export const DOWNLOAD_TYPES = {
  NEW: 0,
  OLD: 1
}
export const RemoveExtension = R.replace(/\.mtd$/, '')
export const GetDownloadType = R.curry((NormalizePath, options$) => {
  const MergeType = type => R.compose(R.merge({type}), R.objOf('options'))
  const GetPathFromURL = R.compose(NormalizePath, GenerateFileName, R.prop('url'))
  const GetPathFromFile = R.compose(NormalizePath, RemoveExtension, R.prop('file'))
  const GetMtdPathFromPath = R.compose(MTDPath, R.prop('path'))
  const MetaAssoc = R.curry((prop, T, options) => R.assoc(prop, T(options), options))
  const setPathFromURL = MetaAssoc('path', GetPathFromURL)
  const setPathFromFile = MetaAssoc('path', GetPathFromFile)
  const setMtdPath = MetaAssoc('mtdPath', GetMtdPathFromPath)

  const [ok$, not$] = options$.partition(x => x.url)
  return O.merge(
    ok$.map(R.compose(setMtdPath, setPathFromURL)).map(MergeType(DOWNLOAD_TYPES.NEW)),
    not$.map(R.compose(setMtdPath, setPathFromFile)).map(MergeType(DOWNLOAD_TYPES.OLD))
  )
})
export const CliValidOptions = R.anyPass([R.has('url'), R.has('file')])
export const RxTakeN = R.curry((n$, $) => {
  const accum = (memory, [value, count]) => {
    return {list: R.append(value, memory.list), count}
  }
  return $.withLatestFrom(n$).scan(accum, {list: []})
    .filter(({list, count}) => R.equals(R.length(list), count))
    .pluck('list')
    .take(1)
})
