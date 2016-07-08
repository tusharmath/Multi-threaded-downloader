/**
 * Created by tushar.mathur on 26/01/16.
 */

'use strict'

import test from 'ava'
import {TestScheduler, ReactiveTest} from 'rx'
import {CreateWriteBufferParams} from '../src/Utils'
const {onNext, onCompleted} = ReactiveTest

test((t) => {
  const sh = new TestScheduler()
  const fd = 19
  const buffer = ['BUFFER', 1024, 1]
  const {messages} = sh.startScheduler(() => CreateWriteBufferParams([fd, buffer]))
  t.deepEqual(messages, [
    onNext(200, [19, 'BUFFER', 0, 6, 1024]),
    onCompleted(200)
  ])
})
