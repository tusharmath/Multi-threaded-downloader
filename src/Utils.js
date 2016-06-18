/**
 * Created by tushar.mathur on 22/01/16.
 */

'use strict'

import PATH from 'path'
import URL from 'url'
import {Observable as O} from 'rx'
import R from 'ramda'
import * as Rx from './RxFP'
import {mux} from 'muxer'
import {MTDError, FILE_SIZE_UNKNOWN} from './Error'

const first = R.nth(0)
const second = R.nth(1)
export const trace = R.curry((msg, value) => {
  console.log(msg, value)
  return value
})
export const BUFFER_SIZE = 512
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
export const CreateRangeHeader = ([start, end]) => `bytes=${start}-${end}`
export const SetRangeHeader = ({request, range}) => R.set(
  R.lensPath(['headers', 'range']),
  CreateRangeHeader(range),
  R.omit(['threads', 'offsets'], request)
)
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
  {mtdPath: options.path + '.mtd', range: 3},
  options
])
/*
 * STREAM BASED
 */
export const RequestDataOffset = ({HTTP, requestParams, offset}) => {
  const HTTPRequestData = R.compose(HTTP.select('data'), HTTP.requestBody)
  const buffer$ = HTTPRequestData(requestParams)
  const accumulator = ([_buffer, _offset], buffer) => [buffer, _buffer.length + _offset]
  return buffer$.scan(accumulator, [{length: 0}, offset])
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
export const CreateMeta$ = ({size$, options}) => {
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
export const ReadFileAt$ = ({FILE, fd$, position$, size = BUFFER_SIZE}) => {
  const readParams$ = O.combineLatest(position$, fd$)
  const buffer = CreateFilledBuffer(size)
  const toParam = ([position, fd]) => [fd, buffer, 0, buffer.length, position]
  return FILE.read(readParams$.map(toParam))
}
export const MetaPosition$ = ({size$}) => size$.map(R.add(-BUFFER_SIZE))
export const WriteBufferAt = ({fd$, buffer$, position$}) => {
  const toParam = ([buffer, fd, position]) => [fd, buffer, 0, buffer.length, position]
  return O.combineLatest(buffer$, fd$, position$.first()).map(toParam)
}
export const WriteBuffer = ({fd$, buffer$, position$}) => {
  const toParams = ([fd, buffer, position]) => [fd, buffer, 0, buffer.length, position]
  return O.combineLatest(fd$, O.zip(buffer$, position$))
    .map(R.compose(toParams, R.unnest))
}
export const UpdateMeta = ({meta$, bytesSaved$}) => {
  const updateMetaOffsets = ({meta, offsets}) => R.mergeAll([meta, {offsets}])
  return bytesSaved$
    .withLatestFrom(meta$, zipUnApply(['offsets', 'meta']))
    .map(updateMetaOffsets)
    .distinctUntilChanged()
}
export const DownloadFromMeta = ({HTTP, meta$}) => {
  const threads = (meta) => meta.threads.map((_, index) => ({meta, index}))
  const Request = R.compose(RequestDataOffset, R.merge({HTTP}))
  const zipObj = R.zipObj(['buffer', 'offset'])
  const Offset = ({meta, index}) => meta.offsets[index]
  const Params = R.applySpec({offset: Offset, requestParams: CreateRequestParams})
  const AttachIndex = ({index}) => Rx.map(R.compose(R.merge({index}), zipObj))
  const RequestParams = R.compose(Request, Params)
  return R.compose(
    Rx.shareReplay(1),
    Rx.flatMap(R.ap(AttachIndex, RequestParams)),
    Rx.flatMap(threads)
  )(meta$)
}
export const DownloadFromMTDFile = ({FILE, HTTP, options}) => {
  const fd$ = FILE.open(O.just([options.mtdPath, 'r+']))
  const size$ = LocalFileSize$({FILE, fd$})
  const metaPosition$ = MetaPosition$({size$})
  const metaBuffer$ = ReadFileAt$({FILE, fd$, position$: metaPosition$}).map(second)
  const meta$ = BufferToJS$(metaBuffer$)
  const loadedOffsets$ = meta$.pluck('offsets')
  const bufferOffsets$ = DownloadFromMeta({HTTP, meta$})
  const buffer$ = bufferOffsets$.pluck('buffer')
  const position$ = bufferOffsets$.pluck('offset')
  const saveBuffer$ = FILE.write(WriteBuffer({FILE, fd$, buffer$, position$}))
  const bytesSaved$ = saveBuffer$
    .zip(bufferOffsets$, R.nthArg(1))
    .map(R.pick(['offset', 'index']))
    .withLatestFrom(loadedOffsets$)
    .scan((previous, current) => {
      const {index, offset} = first(current)
      const offsets = R.set(R.lensIndex(index), offset, second(previous))
      return [current, offsets]
    })
    .map(second)
  const nMeta$ = UpdateMeta({meta$, bytesSaved$})
  const bytes$ = FILE.write(WriteBufferAt({fd$, buffer$: JSToBuffer$(nMeta$), position$: size$}))
  return mux({bytes$, size$, meta$: O.merge(nMeta$, meta$), fd$, metaPosition$})
}
export const CreateMTDFile = ({FILE, HTTP, options}) => {
  const fd$ = FILE.open(O.just([options.mtdPath, 'w']))
  const size$ = RemoteFileSize$({HTTP, options})
  const meta$ = CreateMeta$({options, size$})
  return FILE.write(WriteBufferAt({FILE, fd$, buffer$: JSToBuffer$(meta$), position$: size$}))
}
