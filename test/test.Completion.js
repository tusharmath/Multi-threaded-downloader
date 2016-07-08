/**
 * Created by tushar.mathur on 30/06/16.
 */

'use strict'

import {ReactiveTest, TestScheduler} from 'rx'
import test from 'ava'
import {Completion} from '../src/Utils'
const {onNext, onCompleted} = ReactiveTest

test(t => {
  const sh = new TestScheduler()
  const meta$ = sh.createHotObservable(
    onNext(210, {threads: [], offsets: [], totalBytes: 100}),
    onNext(210, {
      threads: [[0, 50], [51, 100]],
      offsets: [25, 75],
      totalBytes: 100
    }),
    onNext(210, {
      threads: [[0, 50], [51, 100]],
      offsets: [50, 100],
      totalBytes: 100
    }),
    onNext(210, {
      threads: [[0, 50], [51, 100]],
      offsets: [55, 105],
      totalBytes: 100
    }),
    onCompleted(210)
  )
  const {messages} = sh.startScheduler(() => Completion(meta$))
  t.deepEqual(messages, [
    onNext(210, 0),
    onNext(210, 0.5),
    onNext(210, 1),
    onNext(210, 1),
    onCompleted(210)
  ])
})
