/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'
import _ from 'lodash'

export default _.curry((ob, path, flag) => ob.fsOpen(path, flag))
