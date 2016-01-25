/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

const _ = require('lodash')
const bufferOffset = require('./bufferOffset')

module.exports = (baseMeta, bytesSaved) => baseMeta
  .combineLatest(bufferOffset(bytesSaved)
    .pluck('offset'), (a, b) => _.assign(a, {bytesSaved: b}))
