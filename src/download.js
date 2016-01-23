/**
 * Created by tushar.mathur on 20/01/16.
 */

'use strict'
const _ = require('lodash')
const createStore = require('reactive-storage').create
const u = require('./utils')

exports.download = function (ob, options) {
  var writeAt = 0
  const path = options.mtdPath
  const fileDescriptor = ob.fsOpen(path, 'r+')
  const writtenAt = createStore(0)
  const requestStream = ob.requestBody(options)
  const bufferStream = requestStream.filter(x => x.event === 'data').pluck('message')
  const contentLength = fileDescriptor
    .flatMap(x => ob.fsStat(x))
    .pluck('size')
    .map(x => x - 512)

  return fileDescriptor
    .combineLatest(bufferStream, u.selectAs('fd', 'buffer'))
    .map(buffer => _.assign({}, buffer, {offset: writeAt}))
    .tap(x => writeAt += x.buffer.length)
    .flatMap(ob.fsWriteBuffer).map(x => x[0])
    .tap(x => writtenAt.set(o => o + x))
    .tapOnCompleted(() => writtenAt.end())
    .combineLatest(writtenAt.getStream(), (a, b) => b)
    .distinctUntilChanged()
    .withLatestFrom(contentLength, u.selectAs('bytesSaved', 'totalBytes'))
    .map(x => _.assign({}, x, options))
    .map(u.toBuffer)
    .withLatestFrom(fileDescriptor, contentLength, u.selectAs('buffer', 'fd', 'offset'))
    .flatMap(ob.fsWriteBuffer)
    .last().withLatestFrom(contentLength, (a, b) => b)
    .flatMap(len => ob.fsTruncate(path, len))
    .flatMap(() => ob.fsRename(path, options.path))
    .map(options)
}
