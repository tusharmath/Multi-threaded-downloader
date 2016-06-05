/**
 * Created by tushar.mathur on 26/01/16.
 */

'use strict'

import test from 'ava'
import {TestScheduler, ReactiveTest} from 'rx'
import {ContentLoad} from '../src/Utils'
import {createTestObserver} from '../perf/utils'
const {onNext, onCompleted} = ReactiveTest

const noop = function () {
}
const select = () => (x) => x
test('request', (t) => {
  const requests = []
  const scheduler = new TestScheduler()
  const requestBody = (x) => {
    requests.push(x)
    return scheduler.createHotObservable(
      onNext(210, '0-AAA'),
      onCompleted(230)
    )
  }
  const HTTP = {requestBody, select}
  const threads = [
    [0, 10],
    [11, 20],
    [21, 30]
  ]
  const offsets = [0, 11, 21]
  const meta$ = scheduler.createHotObservable(onNext(210, {offsets, threads, url: 'sample-url'}), onCompleted(220))
  ContentLoad({HTTP, meta$}).subscribe(noop)
  scheduler.start()
  t.deepEqual(requests, [
    {headers: {range: 'bytes=0-10'}, url: 'sample-url'},
    {headers: {range: 'bytes=11-20'}, url: 'sample-url'},
    {headers: {range: 'bytes=21-30'}, url: 'sample-url'}
  ])
})

test('response', (t) => {
  const scheduler = new TestScheduler()
  const responseBody = {
    'bytes=0-10': scheduler.createHotObservable(
      onNext(210, '0000'),
      onNext(220, '00000000'),
      onCompleted(230)
    ),
    'bytes=11-20': scheduler.createHotObservable(
      onNext(215, '111'),
      onNext(230, '111111'),
      onCompleted(245)
    )
  }
  const requestBody = (x) => responseBody[x.headers.range]
  const HTTP = {requestBody, select}
  const threads = [
    [0, 10],
    [11, 20]
  ]
  const offsets = [0, 11]
  const meta$ = scheduler.createHotObservable(onNext(200, {offsets, threads, url: 'sample-url'}), onCompleted(250))
  const responses = createTestObserver(ContentLoad({HTTP, meta$}))
  scheduler.start()
  t.deepEqual(responses, [
    {buffer: '0000', offset: 0, range: [0, 10], index: 0},
    {buffer: '111', offset: 11, range: [11, 20], index: 1},
    {buffer: '00000000', offset: 4, range: [0, 10], index: 0},
    {buffer: '111111', offset: 14, range: [11, 20], index: 1}
  ])
})

test('offset', (t) => {
  const scheduler = new TestScheduler()
  const requestBody = (x) => scheduler.createHotObservable(
    onNext(210, '0-AAA'),
    onCompleted(230))
  const HTTP = {requestBody, select}
  const threads = [
    [0, 10],
    [11, 20],
    [21, 30]
  ]
  const offsets = [2, 13, 23]
  const meta$ = scheduler.createHotObservable(onNext(210, {offsets, threads, url: 'sample-url'}), onCompleted(220))
  const out = createTestObserver(ContentLoad({HTTP, meta$}))
  scheduler.start()
  t.deepEqual(out, [
    {buffer: '0-AAA', offset: 2, range: [0, 10], index: 0},
    {buffer: '0-AAA', offset: 13, range: [11, 20], index: 1},
    {buffer: '0-AAA', offset: 23, range: [21, 30], index: 2}
  ])
})
