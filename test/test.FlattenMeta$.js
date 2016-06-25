/**
 * Created by tushar.mathur on 18/06/16.
 */

'use strict'

import test from 'ava'
import {TestScheduler, ReactiveTest} from 'rx'
import {FlattenMeta$} from '../src/Utils'
const {onNext, onCompleted} = ReactiveTest

test((t) => {
  const sh = new TestScheduler()
  const meta = {
    offsets: [10, 21, 23, 35, 41],
    threads: [[0, 10], [11, 20], [21, 30], [31, 40], [41, 50]]
  }
  const meta$ = sh.createHotObservable(
    onNext(210, meta),
    onCompleted(220)
  )
  const {messages} = sh.startScheduler(() => FlattenMeta$(meta$))
  t.deepEqual(messages, [
    onNext(210, {meta, index: 2}),
    onNext(210, {meta, index: 3}),
    onNext(210, {meta, index: 4}),
    onCompleted(220)
  ])
})
