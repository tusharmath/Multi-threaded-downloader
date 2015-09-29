/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict'
const _ = require('lodash')
const utils = require('./lib/Utility')
const ob = require('./lib/Observables')
const {fromJS} = require('immutable')
const {map, times, identity} = _
const MAX_BUFFER = 512
const {Observable} = require('rx')

const defaultOptions = {
  headers: {},
  threadCount: 3,
  strictSSL: true,
  truncate: true,
  rename: true
}

const getContentLength = (res) => parseInt(res.headers['content-length'], 10)
const rangeHeader = (thread) => ({'range': `bytes=${thread.start}-${thread.end}`})
const toBuffer = _.partialRight(utils.toBuffer, MAX_BUFFER)
function download (options) {
  const opt = fromJS(options)
  var writePositions = fromJS(times(opt.get('threadCount'), 0))
  const writableFile = ob.fsOpen(opt.get('path'), 'w+')
  const downloadSize = ob.requestHead(opt.filter(utils.keyIn(['url', 'strictSSL'])).toJS()).map(getContentLength).filter(_.isFinite)
  const downloadedFileWithMeta = downloadSize.combineLatest(writableFile, (size, fd) => opt.set('size', size).set('fd', fd))
    .map(x => x.set('threads', fromJS(utils.sliceRange(x.get('threadCount'), x.get('size')))))
    .flatMap(x => map(x.get('threads').toJS(), (thread, i) => x.set('headers', fromJS(rangeHeader(thread))).set('threadIndex', i).set('start', thread.start)))
    .tap(x => writePositions = writePositions.set(x.get('threadIndex'), x.get('start')))
    .flatMap(x => ob.requestBody(x.filter(utils.keyIn(['url', 'strictSSL', 'headers'])).toJS()).data, (x, data) => x.set('buffer', data.buffer))
    .map(x => x.set('writePositions', writePositions))
    .tap(x => {
      var i = x.get('threadIndex')
      writePositions = writePositions.set(i, writePositions.get(i) + x.get('buffer').length)
    })
    .flatMap(x => ob.fsWrite(x.get('fd'), x.get('buffer'), 0, x.get('buffer').length, x.get('writePositions').get(x.get('threadIndex'))), identity)
    .map(x => x.set('metaBuffer', toBuffer(x.filter(utils.keyIn(['url', 'writePositions', 'path', 'size', 'threads'])).toJS())))
    .flatMap(x => ob.fsWrite(x.get('fd'), x.get('metaBuffer'), 0, x.get('metaBuffer').length, x.get('size')), identity)
    .last()

  return Observable.if(
    () => opt.get('truncate'),
    downloadedFileWithMeta.flatMap(x => ob.fsTruncate(x.get('fd'), x.get('size')), identity),
    downloadedFileWithMeta
  )
    .flatMap(x => ob.fsRename(x.get('path'), x.get('path').replace('.mtd', '')), identity)
}

class Download {
  constructor (options) {
    this.options = _.defaults(options, defaultOptions)
    this.options.path += '.mtd'
  }

  start () {
    return download(this.options).toPromise()
  }

  stop () {
  }
}
module.exports = Download
