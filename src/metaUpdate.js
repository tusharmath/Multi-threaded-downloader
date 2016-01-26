/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

const _ = require('lodash')
const u = require('./utils')
module.exports = (baseMeta, bytesSaved, offsets) => baseMeta
  .combineLatest(bytesSaved, offsets, u.selectAs('meta', 'content', 'offsets'))
  .map(x => _.assign({}, x.meta, {offsets: x.offsets.toJS()}))
  .distinctUntilChanged()
