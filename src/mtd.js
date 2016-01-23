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
    return create(ob, this.options)
      .toPromise()
      .then(() => download(ob, this.options).toPromise())
  }

  stop () {
  }
}
module.exports = Download
