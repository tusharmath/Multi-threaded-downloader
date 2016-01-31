/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

const metaSave = require('./metaSave')
const initMeta = require('./initMeta')

module.exports = (ob, fd, options) => {
  const initialMETA = initMeta(ob, options)
  return metaSave(ob, fd, initialMETA)
}
