/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

import bufferSave from './bufferSave'
import {load, save, update} from './Meta'
import contentLoad from './contentLoad'
import {create} from 'reactive-storage'
import Immutable from 'immutable'

export default (ob, fd) => {
  const offsets = create(Immutable.List([]))
  const loadedMETA = load(fd)
    .tap((x) => offsets.set((i) => i.merge(x.offsets)))
  const loadedContent = contentLoad(ob, loadedMETA)
  const savedContent = bufferSave(ob, fd, loadedContent)
    .tap((x) => offsets.set((i) => i.set(x.index, x.offset)))
  const currentMETA = update(loadedMETA, savedContent, offsets.stream)
  return save(ob, fd, currentMETA)
}
