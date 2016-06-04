/**
 * Created by tushar.mathur on 26/01/16.
 */

'use strict'

import test from 'ava'
import {TestScheduler, ReactiveTest} from 'rx'
import {bufferSave} from '../src/Utils'
import {createTestObserver} from '../perf/utils'
const {onNext, onCompleted} = ReactiveTest

test((t) => {
  const sh = new TestScheduler()
  const ob = {
    fsWriteBuffer: () => sh.createHotObservable(onNext(300, 'hello'), onCompleted(310))
  }
  const fd = sh.createHotObservable(onNext(210, 1000), onCompleted(220))
  const content = sh.createHotObservable(
    onNext(210, {offset: 100, index: 1}),
    onNext(220, {offset: 101, index: 2}),
    onNext(230, {offset: 102, index: 1}),
    onNext(240, {offset: 103, index: 1}),
    onCompleted(250)
  )
  const out = createTestObserver(bufferSave(ob, fd, content))
  sh.start()
  t.deepEqual(out, [
    {offset: 100, fd: 1000, index: 1},
    {offset: 101, fd: 1000, index: 2},
    {offset: 102, fd: 1000, index: 1},
    {offset: 103, fd: 1000, index: 1}
  ])
})
