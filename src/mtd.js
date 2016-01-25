/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict'
const _ = require('lodash')
const download = require('./download').download
const create = require('./create').create
const ob = require('./observables')

class Download {
  constructor (ob, options) {
    this.options = options
    this.options.mtdPath = this.options.path + '.mtd'
    this.fileDescriptorW = ob.fsOpen(this.options.mtdPath, 'w')
    this.fileDescriptorRP = ob.fsOpen(this.options.mtdPath, 'r+')
    this.contentLength = ob.requestContentLength(this.options)
    this.initialMeta = this.contentLength.map(x => _.assign({}, this.options, {totalBytes: x}))
    this.initialMTDFile = create(ob, this.fileDescriptorW, this.initialMeta)
  }

  start () {
    const path = this.options.mtdPath
    return this.initialMTDFile
      .flatMap(() => download(ob, this.fileDescriptorRP))
      .last()
      .flatMap(x => ob.fsTruncate(path, x.totalBytes))
      .flatMap(() => ob.fsRename(path, this.options.path))
      .toPromise()
  }

  stop () {
  }
}
module.exports = Download
