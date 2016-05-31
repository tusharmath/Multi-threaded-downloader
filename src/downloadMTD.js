/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

const _ = require('lodash')

const bufferSave = require('./bufferSave')
const metaSave = require('./metaSave')
const metaLoad = require('./metaLoad')
const contentLoad = require('./contentLoad')
const metaUpdate = require('./metaUpdate')
const create = require('reactive-storage').create
const Immutable = require('immutable')

module.exports = (ob, fd, options) => {
  const offsets = create(Immutable.List([]))
  const loadedMETA = metaLoad(fd)
    .map(meta => _.assign({}, options, meta))
    .tap((x) => offsets.set((i) => i.merge(x.offsets)))
  const loadedContent = contentLoad(ob, loadedMETA)
  const savedContent = bufferSave(ob, fd, loadedContent)
    .tap((x) => offsets.set((i) => i.set(x.index, x.offset)))
  const currentMETA = metaUpdate(loadedMETA, savedContent, offsets.stream)
  return metaSave(ob, fd, currentMETA)
}
