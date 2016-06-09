/**
 * Created by tushar.mathur on 09/06/16.
 */

'use strict'

import {ReadFileAt$, CreateFilledBuffer} from '../src/Utils'
import test from 'ava'
import {spy} from 'sinon'
import {TestScheduler, ReactiveTest} from 'rx'
const {onNext, onCompleted} = ReactiveTest

test(t => {
  const sh = new TestScheduler()
  const fd$ = sh.createHotObservable(onNext(210, 10), onCompleted(220))
  const position$ = sh.createHotObservable(onNext(220, 1024), onCompleted(230))
  const fsRead = spy()
  const FILE = {read: x => x.map(fsRead)}
  sh.startScheduler(() => ReadFileAt$({FILE, fd$, position$, size: 12}))
  t.true(fsRead.calledWith([10, CreateFilledBuffer(12), 0, 12, 1024]))
})
