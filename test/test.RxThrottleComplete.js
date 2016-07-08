/**
 * Created by tushar.mathur on 21/06/16.
 */

'use strict'

import {RxThrottleComplete} from '../src/Utils'
import test from 'ava'
import {ReactiveTest, TestScheduler} from 'rx'
const {onNext, onCompleted} = ReactiveTest
test(t => {
  const sh = new TestScheduler()
  const $ = sh.createHotObservable(
    onNext(210, 0),
    onNext(220, 1),
    onNext(230, 2),
    onNext(240, 3),
    onNext(250, 4),
    onCompleted(260)
  )
  const window$ = sh.createColdObservable(onNext(0, 30))
  const {messages} = sh.startScheduler(() => RxThrottleComplete(window$, $, sh))
  t.deepEqual(messages, [
    onNext(210, 0),
    onNext(240, 3),
    onNext(260, 4),
    onCompleted(260)
  ])
})
