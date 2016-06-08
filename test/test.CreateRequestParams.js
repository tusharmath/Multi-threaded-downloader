/**
 * Created by tushar.mathur on 09/06/16.
 */

'use strict'

import test from 'ava'
import {CreateRequestParams} from '../src/Utils'

test((t) => {
  const meta = {
    url: '/abc',
    offsets: [10, 20, 30],
    threads: [[0, 15], [16, 25], [26, 35]],
    headers: {a: '1'}
  }
  const index = 1
  const range = [10, 100]
  t.deepEqual(
    CreateRequestParams({meta, index, range}),
    {url: '/abc', headers: {a: '1', range: 'bytes=20-25'}}
  )
})
