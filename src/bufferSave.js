/**
 * Created by tushar.mathur on 20/01/16.
 */

'use strict'
const _ = require('lodash')
const createStore = require('reactive-storage').create
const u = require('./utils')
const Rx = require('rx')
const loadContent = require('./loadContent')

module.exports = function (ob, meta, fileDescriptor) {
  const writtenAt = createStore(0)
  const createMETA = Rx.Observable.just(meta)
  const contentLength = createMETA.pluck('totalBytes')
  const content = loadContent(ob, meta)
    .combineLatest(fileDescriptor, (content, fd) => _.assign({}, content, {fd}))

  const downloadMETA = content
    .flatMap(ob.fsWriteBuffer)
    .map(x => x[0])
    .tap(x => writtenAt.set(o => o + x))
    .tapOnCompleted(() => writtenAt.end())
    .combineLatest(writtenAt.getStream(), (a, b) => b)
    .distinctUntilChanged()
    .withLatestFrom(createMETA, u.selectAs('bytesSaved', 'meta'))
    .map(x => _.assign({}, x.meta, {bytesSaved: x.bytesSaved}))

  return downloadMETA
    .withLatestFrom(fileDescriptor, contentLength, u.selectAs('json', 'fd', 'offset'))
    .flatMap(ob.fsWriteJSON)
    .withLatestFrom(createMETA, writtenAt.getStream(), (a, b, c) => _.assign({}, b, {bytesSaved: c}))
}
