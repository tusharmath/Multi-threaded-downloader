/**
 * Created by tushar.mathur on 26/01/16.
 */

'use strict'
import test from 'ava'
import {SplitRange} from '../src/Utils'

test((t) => {
  t.deepEqual(SplitRange(100, 2), [[0, 49], [50, 100]])
  t.deepEqual(SplitRange(100, 3), [[0, 32], [33, 65], [66, 100]])
})
