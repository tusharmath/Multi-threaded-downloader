/**
 * Created by tushar.mathur on 10/06/16.
 */

'use strict'
import test from 'ava'
import {TestScheduler, ReactiveTest, Observable as O} from 'rx'
import {spy} from 'sinon'
import {mux} from 'muxer'
import {RequestThread} from '../src/Utils'
const {onNext, onCompleted} = ReactiveTest

test('response$', (t) => {
  const sh = new TestScheduler()
  const data$ = sh.createHotObservable(
    onNext(220, 'BUFFER'),
    onNext(230, 'BUFFER1'),
    onNext(240, 'BUFFER22'),
    onNext(250, 'BUFFER333'),
    onCompleted(250)
  )
  const response$ = sh.createHotObservable(onNext(210, 'RESPONSE'), onCompleted(210))
  const HTTP = {request: () => mux({data$, response$})}
  const meta = {
    threads: [[0, 100], [101, 200], [201, 300]],
    offsets: [50, 150, 250]
  }
  const index = 1
  const {messages} = sh.startScheduler(
    () => RequestThread(HTTP, {meta, index})
  )
  t.deepEqual(messages, [
    onNext(210, ['response$', 'RESPONSE']),
    onNext(220, ['buffer$', ['BUFFER', 150, 1]]),
    onNext(230, ['buffer$', ['BUFFER1', 156, 1]]),
    onNext(240, ['buffer$', ['BUFFER22', 163, 1]]),
    onNext(250, ['buffer$', ['BUFFER333', 171, 1]]),
    onCompleted(250)
  ])
})

test('request', (t) => {
  const sh = new TestScheduler()
  const data$ = sh.createHotObservable(
    onNext(220, 'BUFFER'),
    onCompleted(250)
  )
  const response$ = sh.createHotObservable(onNext(210, 'RESPONSE'), onCompleted(210))
  const HTTP = {request: spy(() => mux({data$, response$}))}
  const meta = {
    url: '/a/b/c',
    threads: [[0, 100], [101, 200], [201, 300]],
    offsets: [50, 150, 250]
  }
  const index = 1
  sh.startScheduler(() => RequestThread(HTTP, {meta, index}))
  t.true(HTTP.request.calledWith({
    url: '/a/b/c',
    headers: {range: 'bytes=150-200'}
  }))
})

test('curried', (t) => {
  const sh = new TestScheduler()
  const data$ = O.never()
  const response$ = O.never()
  const HTTP = {request: () => mux({data$, response$})}
  const meta = {
    threads: [[0, 100], [101, 200], [201, 300]],
    offsets: [50, 150, 250]
  }
  const index = 1
  /**
   * CURRY CALL
   */
  sh.startScheduler(() => RequestThread(HTTP)({meta, index}))
})
