/**
 * Created by tushar.mathur on 21/01/16.
 */

'use strict'

const ob = require('./src/observables')
const Mtd = require('./src/mtd')

exports.createDownload = (options) => new Mtd(ob, options)
