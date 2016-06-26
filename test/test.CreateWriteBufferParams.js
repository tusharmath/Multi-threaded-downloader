/**
 * Created by tushar.mathur on 26/01/16.
 */

'use strict'

import test from 'ava'
import {spy} from 'sinon'
import {TestScheduler, ReactiveTest} from 'rx'
import {CreateWriteBufferParams} from '../src/Utils'
const {onNext, onCompleted} = ReactiveTest

test((t) => {
  const sh = new TestScheduler()
  const fsWrite = spy()
  const FILE = {
    write: (z) => z.map(fsWrite)
  }
  const fd$ = sh.createHotObservable(onNext(210, 1000), onCompleted(220))
  const buffer$ = sh.createHotObservable(
    onNext(210, ['AA', 10]),
    onNext(220, ['BBB', 20]),
    onNext(230, ['CCCC', 30])
  )
  const {messages} = sh.startScheduler(
    () => CreateWriteBufferParams({FILE, fd$, buffer$})
  )
  t.deepEqual(messages, [
    onNext(210, [1000, 'AA', 0, 2, 10]),
    onNext(220, [1000, 'BBB', 0, 3, 20]),
    onNext(230, [1000, 'CCCC', 0, 4, 30])
  ])
})
