/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

import metaSave from './metaSave'
import initMeta from './initMeta'

export default (ob, fd, options) => {
  const initialMETA = initMeta(ob, options)
  return metaSave(ob, fd, initialMETA)
}
