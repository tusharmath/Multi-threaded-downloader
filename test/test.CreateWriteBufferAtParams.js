/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

import {CreateWriteBufferAtParams} from '../src/Utils'
import test from 'ava'
import {TestScheduler, ReactiveTest} from 'rx'
import {spy} from 'sinon'

const {onNext, onCompleted} = ReactiveTest

test((t) => {
  const fsWrite = spy()
  const FILE = {write: x => x.map(fsWrite)}
  const sh = new TestScheduler()
  const fd$ = sh.createHotObservable(onNext(201, 20), onCompleted(250))
  const buffer$ = sh.createHotObservable(
    onNext(210, 'MOCK-BUFFER-10'),
    onNext(220, 'MOCK-BUFFER-20'),
    onNext(230, 'MOCK-BUFFER-30'),
    onCompleted(250)
  )
  const position$ = sh.createHotObservable(
    onNext(202, 1024),
    onNext(222, 2048),
    onCompleted(250)
  )
  const {messages} = sh.startScheduler(() => CreateWriteBufferAtParams({FILE, fd$, buffer$, position$}))
  t.deepEqual(messages, [
    onNext(210, [20, 'MOCK-BUFFER-10', 0, 14, 1024]),
    onNext(220, [20, 'MOCK-BUFFER-20', 0, 14, 1024]),
    onNext(230, [20, 'MOCK-BUFFER-30', 0, 14, 1024]),
    onCompleted(250)
  ])
})
