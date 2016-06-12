/**
 * Created by tushar.mathur on 05/06/16.
 */

'use strict'

import test from 'ava'
import {TestScheduler, ReactiveTest} from 'rx'
import {BufferOffset$} from '../src/Utils'
const {onNext, onCompleted} = ReactiveTest

const buffer = (length) => ({length})
test((t) => {
  const sh = new TestScheduler()
  const buffer$ = sh.createHotObservable(
    onNext(210, buffer(1)),
    onNext(220, buffer(10)),
    onNext(230, buffer(100)),
    onNext(240, buffer(1000)),
    onCompleted(250)
  )
  const {messages} = sh.startScheduler(() => BufferOffset$({buffer$, offset: 5}))
  t.deepEqual(messages, [
    onNext(210, [5, buffer(1)]),
    onNext(220, [6, buffer(10)]),
    onNext(230, [16, buffer(100)]),
    onNext(240, [116, buffer(1000)]),
    onCompleted(250)
  ])
})
