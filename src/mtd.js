/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict'
const _ = require('lodash')
const ob = require('./observables')
const download = require('./download').download

const defaultOptions = {
  headers: {},
  threadCount: 3,
  strictSSL: true,
  truncate: true,
  rename: true,
  maxBuffer: 512
}

class Download {
  constructor (options) {
    this.options = _.defaults(options, defaultOptions)
    this.options.mtdPath = this.options.path + '.mtd'
  }

  start () {
    return download(ob, this.options).toPromise()
  }

  stop () {
  }
}
module.exports = Download
