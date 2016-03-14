/**
 * Created by tushar.mathur on 26/01/16.
 */

'use strict'
import test from 'ava'
import splitRange from '../src/splitRange'

test((t) => {
  t.same(splitRange(100, 2), [[0, 49], [50, 100]])
  t.same(splitRange(100, 3), [[0, 32], [33, 65], [66, 100]])
})

test.only('invalid values', (t) => {
  t.same(splitRange(100, 0), [[0, 100]])
  t.same(splitRange(100, null), [[0, 100]])
  t.same(splitRange(100, NaN), [[0, 100]])
})
