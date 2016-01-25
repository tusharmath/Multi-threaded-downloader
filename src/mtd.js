/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict'
const _ = require('lodash')
const download = require('./download').download
const create = require('./create').create
const createFileDescriptors = require('./createFileDescriptors')
const ob = require('./observables')

class Download {
  constructor (ob, options) {
    this.options = options
    this.options.mtdPath = this.options.path + '.mtd'
    this.ob = ob
  }

  start () {
    const options = this.options
    const path = options.mtdPath
    const ob = this.ob
    const fileDescriptors = createFileDescriptors(ob, path)
    const fileDescriptorW = fileDescriptors.pluck('w')
    const fileDescriptorRP = fileDescriptors.pluck('r+')
    const contentLength = ob.requestContentLength(options)
    const initialMeta = contentLength.map(x => _.assign({}, options, {totalBytes: x}))
    const initialMTDFile = create(ob, fileDescriptorW, initialMeta)

    return initialMTDFile
      .flatMap(() => download(ob, fileDescriptorRP))
      .last()
      .flatMap(x => ob.fsTruncate(path, x.totalBytes))
      .flatMap(() => ob.fsRename(path, options.path))
      .toPromise()
  }

  stop () {
  }
}
module.exports = Download
