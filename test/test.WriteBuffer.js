/**
 * Created by tushar.mathur on 26/01/16.
 */

'use strict'

import test from 'ava'
import {spy} from 'sinon'
import {TestScheduler, ReactiveTest} from 'rx'
import {WriteBuffer} from '../src/Utils'
const {onNext, onCompleted} = ReactiveTest

test((t) => {
  const sh = new TestScheduler()
  const fsWrite = spy()
  const FILE = {
    write: (z) => z.map(fsWrite)
  }
  const fd$ = sh.createHotObservable(onNext(210, 1000), onCompleted(220))
  const buffer$ = sh.createHotObservable(
    onNext(210, 'AA'),
    onNext(220, 'BBB'),
    onNext(230, 'CCCC')
  )
  const position$ = sh.createHotObservable(
    onNext(209, 10),
    onNext(222, 20),
    onNext(229, 30)
  )
  const {messages} = sh.startScheduler(() => WriteBuffer({FILE, fd$, buffer$, position$}))
  // fs.write(fd, buffer, offset, length[, position], callback)
  t.deepEqual(messages, [
    onNext(210, [1000, 'AA', 0, 2, 10]),
    onNext(222, [1000, 'BBB', 0, 3, 20]),
    onNext(230, [1000, 'CCCC', 0, 4, 30])
  ])
})
