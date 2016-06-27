/**
 * Created by tushar.mathur on 27/06/16.
 */

'use strict'

import {ReactiveTest, TestScheduler} from 'rx'
import test from 'ava'
import {WriteBuffer} from '../src/Utils'
const {onNext, onCompleted} = ReactiveTest

test(t => {
  const sh = new TestScheduler()
  const written$ = sh.createColdObservable(onNext(30, [777, 'WRITTEN']), onCompleted(30))
  const buffer$ = sh.createHotObservable(
    onNext(210, ['BUFF', 100, 10]),
    onCompleted(210)
  )
  const fd$ = sh.createHotObservable(
    onNext(220, 19), onCompleted(220)
  )
  const FILE = {write: () => written$}
  const {messages} = sh.startScheduler(() => WriteBuffer({FILE, buffer$, fd$}))
  t.deepEqual(messages, [
    onNext(250, ['BUFF', 100, 10, 777, 'WRITTEN']),
    onCompleted(250)
  ])
})
