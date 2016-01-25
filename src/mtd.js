/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict'
const _ = require('lodash')
const download = require('./download').download
const create = require('./create').create
const createFileDescriptors = require('./createFD')
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
    const fd = createFileDescriptors(ob, path)
    const fdW = fd.filter(x => x.flag === 'w').pluck('fd')
    const fdRP = fd.filter(x => x.flag === 'r+').pluck('fd')
    const contentLength = ob.requestContentLength(options)
    const initialMeta = contentLength.map(x => _.assign({}, options, {totalBytes: x}))
    const initialMTDFile = create(ob, fdW, initialMeta)

    return initialMTDFile
      .flatMap(() => download(ob, fdRP))
      .last()
      .flatMap(x => ob.fsTruncate(path, x.totalBytes))
      .flatMap(() => ob.fsRename(path, options.path))
      .toPromise()
  }

  stop () {
  }
}
module.exports = Download
