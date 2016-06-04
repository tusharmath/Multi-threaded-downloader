/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

import {save} from './Meta'
import {initialize} from './Meta'

export default (ob, fd, options) => {
  const initialMETA = initialize(ob, options)
  return save(ob, fd, initialMETA)
}
