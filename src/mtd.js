/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict'
const download = require('./download').download
const create = require('./create').create
const ob = require('./observables')

class Download {
  constructor (options) {
    this.options = options
    this.options.mtdPath = this.options.path + '.mtd'
  }

  start () {
    const path = this.options.mtdPath

    return create(ob, this.options)
      .flatMap(() => download(ob, this.options.mtdPath))
      .last()
      .flatMap(x => ob.fsTruncate(path, x.totalBytes))
      .flatMap(() => ob.fsRename(path, this.options.path))
      .toPromise()
  }

  stop () {
  }
}
module.exports = Download
