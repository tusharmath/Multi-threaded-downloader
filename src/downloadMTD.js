/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

const bufferSave = require('./bufferSave')
const metaSave = require('./metaSave')
const metaLoad = require('./metaLoad')
const contentLoad = require('./contentLoad')
const bufferOffset = require('./bufferOffset')
const metaUpdate = require('./metaUpdate')

module.exports = (ob, fd, options) => {
  const loadedMETA = metaLoad(fd)
  const path = options.mtdPath
  const content = contentLoad(ob, loadedMETA)
  const writeBuffer = bufferSave(ob, fd, content)
  const currentMETA = metaUpdate(loadedMETA, bufferOffset(writeBuffer).pluck('offset'))

  return metaSave(ob, fd, currentMETA)
    .last()
    .flatMap(x => ob.fsTruncate(path, x.totalBytes))
    .flatMap(() => ob.fsRename(path, options.path))
}
