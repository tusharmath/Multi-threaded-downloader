/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'
const _ = require('lodash')

module.exports = _.curry((ob, path, flag) => ob.fsOpen(path, flag))
