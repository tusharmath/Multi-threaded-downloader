/**
 * Created by tushar.mathur on 18/06/16.
 */

'use strict'

import {SetMetaOffsets} from '../src/Utils'
import test from 'ava'
import {ReactiveTest, TestScheduler} from 'rx'
const {onNext, onCompleted} = ReactiveTest

test(t => {
  const sh = new TestScheduler()
  const bufferWritten$ = sh.createHotObservable(
    onNext(310, ['BUFFER', 0, 0, 4, 'WRITTEN']),
    onNext(320, ['BUFFER', 10, 1, 4, 'WRITTEN']),
    onNext(330, ['BUFFER', 20, 2, 4, 'WRITTEN']),
    onCompleted(330)
  )
  const meta$ = sh.createHotObservable(
    onNext(205, {offsets: [0, 10, 20], restParams: '#'}),
    onCompleted(205)
  )
  const {messages} = sh.startScheduler(
    () => SetMetaOffsets({bufferWritten$, meta$})
  )
  t.deepEqual(messages, [
    onNext(310, {offsets: [4, 10, 20], restParams: '#'}),
    onNext(320, {offsets: [4, 14, 20], restParams: '#'}),
    onNext(330, {offsets: [4, 14, 24], restParams: '#'}),
    onCompleted(330)
  ])
})
