/**
 * Created by tushar.mathur on 24/06/16.
 */

'use strict'

import test from 'ava'
import {TestScheduler, ReactiveTest} from 'rx'
import {GetBufferWriteOffset} from '../src/Utils'
const {onNext, onCompleted} = ReactiveTest

test(t => {
  const sh = new TestScheduler()
  const buffer$ = sh.createHotObservable(
    onNext(220, 'BUFFER'),
    onNext(230, 'BUFFER1'),
    onNext(240, 'BUFFER22'),
    onNext(250, 'BUFFER333'),
    onCompleted(260)
  )

  const {messages} = sh.startScheduler(() => GetBufferWriteOffset({buffer$, initialOffset: 1000}))
  t.deepEqual(messages, [
    onNext(220, ['BUFFER', 1000]),
    onNext(230, ['BUFFER1', 1006]),
    onNext(240, ['BUFFER22', 1013]),
    onNext(250, ['BUFFER333', 1021]),
    onCompleted(260)
  ])
})
