/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

import bufferSave from './bufferSave'
import metaSave from './metaSave'
import metaLoad from './metaLoad'
import contentLoad from './contentLoad'
import metaUpdate from './metaUpdate'
import {create} from 'reactive-storage'
import Immutable from 'immutable'

export default (ob, fd) => {
  const offsets = create(Immutable.List([]))
  const loadedMETA = metaLoad(fd)
    .tap((x) => offsets.set((i) => i.merge(x.offsets)))
  const loadedContent = contentLoad(ob, loadedMETA)
  const savedContent = bufferSave(ob, fd, loadedContent)
    .tap((x) => offsets.set((i) => i.set(x.index, x.offset)))
  const currentMETA = metaUpdate(loadedMETA, savedContent, offsets.stream)
  return metaSave(ob, fd, currentMETA)
}
