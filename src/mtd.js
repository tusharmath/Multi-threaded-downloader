/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict'
const _ = require('lodash')
const bufferSave = require('./bufferSave')
const metaSave = require('./metaSave')
const createFD = require('./createFD')
const metaLoad = require('./metaLoad')
const contentLoad = require('./contentLoad')
const bufferOffset = require('./bufferOffset')
const metaUpdate = require('./metaUpdate')

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
    const fd = createFD(ob, path)
    const contentLength = ob.requestContentLength(options)
    const initialMeta = contentLength.map(x => _.assign({}, options, {totalBytes: x}))
    const initialMTDFile = metaSave(ob, fd['w'], initialMeta)
    const initialMETA = initialMTDFile.flatMap(() => metaLoad(fd['r+']))
    const content = contentLoad(ob, initialMETA)
    const writeBuffer = bufferSave(ob, fd['r+'], content)
    const currentMETA = metaUpdate(initialMETA, bufferOffset(writeBuffer).pluck('offset'))

    return metaSave(ob, fd['r+'], currentMETA)
      .last()
      .flatMap(x => ob.fsTruncate(path, x.totalBytes))
      .flatMap(() => ob.fsRename(path, options.path))
      .toPromise()
  }

  stop () {
  }
}
module.exports = Download
