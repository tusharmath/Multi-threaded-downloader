/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

import metaSave from '../../src/metaSave'
import test from 'ava'
import {TestScheduler, ReactiveTest} from 'rx'
import {createTestObserver} from '../../perf/utils'

const {onNext, onCompleted} = ReactiveTest

test((t) => {
  const scheduler = new TestScheduler()
  const fsWriteJSON = (x) => [[null, JSON.stringify(x.json)]]
  const fd = scheduler.createHotObservable(onNext(210, 20), onCompleted())
  const json = scheduler.createHotObservable(
    onNext(220, {a: 0, totalBytes: 100}),
    onNext(230, {a: 1, totalBytes: 100}),
    onNext(240, {a: 2, totalBytes: 100}),
    onCompleted()
  )

  const ob = {fsWriteJSON}
  const out = createTestObserver(metaSave(ob, fd, json))
  scheduler.start()
  t.same(out, [
    {a: 0, totalBytes: 100},
    {a: 1, totalBytes: 100},
    {a: 2, totalBytes: 100}
  ])
})

test('delayed:fd', (t) => {
  const scheduler = new TestScheduler()
  const fsWriteJSON = (x) => [[null, JSON.stringify(x.json)]]
  const fd = scheduler.createHotObservable(onNext(250, 20), onCompleted())
  const json = scheduler.createHotObservable(
    onNext(220, {a: 0, totalBytes: 100}),
    onCompleted()
  )

  const ob = {fsWriteJSON}
  const out = createTestObserver(metaSave(ob, fd, json))
  scheduler.start()
  t.same(out, [{a: 0, totalBytes: 100}])
})
