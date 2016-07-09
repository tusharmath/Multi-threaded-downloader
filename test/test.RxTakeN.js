/**
 * Created by tushar.mathur on 09/07/16.
 */

'use strict'

import {ReactiveTest, TestScheduler} from 'rx'
import test from 'ava'
import {RxTakeN} from '../src/Utils'
const {onNext, onCompleted} = ReactiveTest

test(t => {
  const sh = new TestScheduler()
  const n$ = sh.createColdObservable(onNext(15, 3), onCompleted(15))
  const $ = sh.createColdObservable(
    onNext(10, 'A'),
    onNext(20, 'B'),
    onNext(30, 'C'),
    onNext(40, 'D'),
    onNext(50, 'E'),
    onCompleted(100)
  )
  const {messages} = sh.startScheduler(() => RxTakeN(n$, $))
  t.deepEqual(messages, [
    onNext(240, ['B', 'C', 'D']),
    onCompleted(240)
  ])
})
