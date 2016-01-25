/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict'
const createFD = require('./createFD')
const initMTD = require('./initMTD')
const downloadMTD = require('./downloadMTD')
const _ = require('lodash')

const defaultOptions = {range: 3}
class Download {
  constructor (ob, options) {
    this.options = _.defaults(options, defaultOptions)
    this.options.mtdPath = this.options.path + '.mtd'
    this.ob = ob
    this.fd = createFD(ob, options.mtdPath)
  }

  start () {
    const options = this.options
    const ob = this.ob
    return initMTD(ob, this.fd['w'], options).flatMap(() => this.download())
  }

  download () {
    const fd = this.fd['r+']
    const options = this.options
    const ob = this.ob
    return downloadMTD(ob, fd, options)
  }

  stop () {
  }
}
module.exports = Download
