/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

const bufferSave = require('./bufferSave')
const metaSave = require('./metaSave')
const metaLoad = require('./metaLoad')
const contentLoad = require('./contentLoad')
const metaUpdate = require('./metaUpdate')

module.exports = (ob, fd) => {
  const loadedMETA = metaLoad(fd)
  const loadedBuffer = contentLoad(ob, loadedMETA)
  const savedBuffer = bufferSave(ob, fd, loadedBuffer)
  const currentMETA = metaUpdate(loadedMETA, savedBuffer)

  return metaSave(ob, fd, currentMETA)
}
