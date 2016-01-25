/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

const _ = require('lodash')

module.exports = (baseMeta, bytesSaved) => baseMeta
  .combineLatest(bytesSaved, (a, b) => _.assign(a, {bytesSaved: b}))
