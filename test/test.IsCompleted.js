/**
 * Created by tushar.mathur on 23/06/16.
 */

'use strict'

import test from 'ava'
import {TestScheduler, ReactiveTest} from 'rx'
import {IsCompleted$} from '../src/Utils'
const {onNext, onCompleted} = ReactiveTest

test('eq', t => {
  const sh = new TestScheduler()
  const threads = [[0, 10], [11, 20], [21, 30]]
  const meta$ = sh.createHotObservable(
    onNext(210, {threads, offsets: [5, 15, 25]}),
    onNext(220, {threads, offsets: [5, 20, 25]}),
    onNext(230, {threads, offsets: [10, 20, 30]}),
    onCompleted(250)
  )
  const {messages} = sh.startScheduler(() => IsCompleted$(meta$))
  t.deepEqual(messages, [
    onNext(210, false),
    onNext(230, true),
    onCompleted(250)
  ])
})

test('gt', t => {
  const sh = new TestScheduler()
  const threads = [[0, 10], [11, 20], [21, 30]]
  const meta$ = sh.createHotObservable(
    onNext(210, {threads, offsets: [11, 21, 31]}),
    onCompleted(220)
  )
  const {messages} = sh.startScheduler(() => IsCompleted$(meta$))
  t.deepEqual(messages, [
    onNext(210, true),
    onCompleted(220)
  ])
})
