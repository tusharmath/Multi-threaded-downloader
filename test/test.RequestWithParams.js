/**
 * Created by tushar.mathur on 26/06/16.
 */

'use strict'

import {ReactiveTest, TestScheduler} from 'rx'
import test from 'ava'
import {spy} from 'sinon'
import {RequestWithParams} from '../src/Utils'
const {onNext, onCompleted} = ReactiveTest

const meta = {
  threads: [[0, 10], [11, 20], [21, 30]],
  offsets: [5, 15, 25],
  url: '/a/b/c'
}
const Response = (sh) => sh.createHotObservable(
  onNext(210, 'BUFFER0'),
  onNext(220, 'BUFFER1'),
  onCompleted(220)
)

test(t => {
  const sh = new TestScheduler()
  const response$ = Response(sh)
  const HTTP = {request: () => response$}
  const index = 1
  const {messages} = sh.startScheduler(
    () => RequestWithParams(HTTP)({meta, index})
  )
  t.deepEqual(messages, [
    onNext(210, 'BUFFER0'),
    onNext(220, 'BUFFER1'),
    onCompleted(220)
  ])
})

test('request args', t => {
  const sh = new TestScheduler()
  const response$ = Response(sh)
  const HTTP = {request: spy(() => response$)}
  const index = 1
  sh.startScheduler(() => RequestWithParams(HTTP)({meta, index}))
  t.true(HTTP.request.calledWith({
    url: '/a/b/c',
    headers: {range: 'bytes=15-20'}
  }))
})

test('uncurried', t => {
  const sh = new TestScheduler()
  const response$ = Response(sh)
  const HTTP = {request: spy(() => response$)}
  const index = 1
  sh.startScheduler(() => RequestWithParams(HTTP, {meta, index}))
  t.true(HTTP.request.calledWith({
    url: '/a/b/c',
    headers: {range: 'bytes=15-20'}
  }))
})
