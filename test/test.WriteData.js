/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

import {WriteData} from '../src/Utils'
import test from 'ava'
import {TestScheduler, ReactiveTest} from 'rx'
import {spy} from 'sinon'

const {onNext, onCompleted} = ReactiveTest

test((t) => {
  t.plan(3)
  const fsWrite = spy()
  const FILE = {write: x => x.map(fsWrite)}
  const sh = new TestScheduler()
  const fd$ = sh.createHotObservable(onNext(201, 20), onCompleted(250))
  const data$ = sh.createHotObservable(
    onNext(210, 10),
    onNext(220, 20),
    onNext(230, 30),
    onCompleted(250)
  )
  const size$ = sh.createHotObservable(onNext(202, 1024), onCompleted(250))
  const toBuffer$ = x => x.map(i => 'MOCK-BUFFER-' + i)
  sh.startScheduler(() => WriteData({FILE, fd$, data$, size$, toBuffer$}))
  t.deepEqual(fsWrite.getCall(0).args[0], [20, 'MOCK-BUFFER-10', 0, 14, 1024])
  t.deepEqual(fsWrite.getCall(1).args[0], [20, 'MOCK-BUFFER-20', 0, 14, 1024])
  t.deepEqual(fsWrite.getCall(2).args[0], [20, 'MOCK-BUFFER-30', 0, 14, 1024])
})
