/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'
const Rx = require('rx')
const u = require('./utils')

module.exports = (ob, path) => Rx.Observable.combineLatest(
  ob.fsOpen(path, 'w'),
  ob.fsOpen(path, 'r+'),
  u.selectAs('w', 'r+')
)
