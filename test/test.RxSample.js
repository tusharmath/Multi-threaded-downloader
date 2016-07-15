/**
 * Created by tushar.mathur on 15/07/16.
 */

'use strict'

import {ReactiveTest, TestScheduler} from 'rx'
import test from 'ava'
import {sample} from '../src/RxFP'
const {onNext, onCompleted} = ReactiveTest

test(t => {
  const sh = new TestScheduler()
  const s0$ = sh.createHotObservable(onNext(210, 0), onCompleted(210))
  const s1$ = sh.createHotObservable(onNext(215, 1), onCompleted(215))
  const t$ = sh.createHotObservable(
    onNext(220, 10),
    onNext(230, 20),
    onCompleted(230)
  )
  const {messages} = sh.startScheduler(() => sample([s0$, s1$], t$))
  t.deepEqual(messages, [
    onNext(220, [0, 1]),
    onNext(230, [0, 1]),
    onCompleted(230)
  ])
})
