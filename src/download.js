/**
 * Created by tushar.mathur on 20/01/16.
 */

'use strict'
const _ = require('lodash')
const createStore = require('reactive-storage').create

const log = function () {
  console.log.apply(console, _.toArray(arguments))
}

const toBuffer = function (obj, size) {
  var buffer = new Buffer(size)
  _.fill(buffer, null)
  buffer.write(JSON.stringify(obj))
  return buffer
}

const selectAs = function () {
  const keys = _.toArray(arguments)
  return function () {
    const values = _.toArray(arguments)
    const merge = (m, k, i) => m[k] = values[i]
    return _.transform(keys, merge, {})
  }
}

exports.download = function (ob, options) {
  var writeAt = 0
  const path = options.mtdPath
  const fileDescriptor = ob.fsOpen(path, 'w+')
  const writtenAt = createStore(0)
  const requestStream = ob.requestBody(options)
  const bufferStream = requestStream.filter(x => x.event === 'data').pluck('message')
  const contentLength = requestStream
    .filter(x => x.event === 'response')
    .pluck('message', 'headers', 'content-length')
    .map(x => parseInt(x, 10))

  return fileDescriptor
    .combineLatest(bufferStream, selectAs('fd', 'buffer'))
    .map(buffer => _.assign({}, buffer, {offset: writeAt}))
    .tap(x => writeAt += x.buffer.length)
    .flatMap(ob.fsWriteBuffer).map(x => x[0])
    .tap(x => writtenAt.set(o => o + x))
    .tapOnCompleted(() => writtenAt.end())
    .combineLatest(writtenAt.getStream(), (a, b) => b)
    .distinctUntilChanged()
    .withLatestFrom(contentLength, selectAs('bytesSaved', 'totalBytes'))
    .map(x => _.assign({}, x, options))
    .map(x => toBuffer(x, options.maxBuffer))
    .withLatestFrom(fileDescriptor, contentLength, selectAs('buffer', 'fd', 'offset'))
    .flatMap(ob.fsWriteBuffer)
    .last().withLatestFrom(contentLength, (a, b) => b)
    .flatMap(len => ob.fsTruncate(path, len))
    .flatMap(() => ob.fsRename(path, options.path))
    .map(options)
}
