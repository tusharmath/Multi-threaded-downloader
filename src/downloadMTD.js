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
  const loadedContent = contentLoad(ob, loadedMETA)
  const savedContent = bufferSave(ob, fd, loadedContent)
  const currentMETA = metaUpdate(loadedMETA, savedContent)

  return metaSave(ob, fd, currentMETA)
}
