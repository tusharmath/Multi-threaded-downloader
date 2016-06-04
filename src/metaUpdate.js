/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

import _ from 'lodash'
import * as u from './utils'
export default (baseMeta, bytesSaved, offsets) => bytesSaved
  .withLatestFrom(baseMeta, offsets, u.selectAs('content', 'meta', 'offsets'))
  .map((x) => _.assign({}, x.meta, {offsets: x.offsets.toJS()}))
  .distinctUntilChanged()
