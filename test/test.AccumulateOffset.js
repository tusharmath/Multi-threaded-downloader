/**
 * Created by tushar.mathur on 18/06/16.
 */

'use strict'

import {AccumulateOffset} from '../src/Utils'
import test from 'ava'
import {ReactiveTest, TestScheduler} from 'rx'
const {onNext} = ReactiveTest

test(t => {
  const sh = new TestScheduler()
  const written$ = sh.createHotObservable(
    onNext(310, 3), onNext(320, 3), onNext(330, 3),
    onNext(340, 3), onNext(350, 3), onNext(360, 3)
  )
  const thread$ = sh.createHotObservable(
    onNext(205, 0), onNext(215, 1), onNext(225, 2),
    onNext(235, 0), onNext(245, 0), onNext(255, 1)
  )
  const meta$ = sh.createHotObservable(onNext(205, {offsets: [0, 10, 20], restParams: '#'}))
  const {messages} = sh.startScheduler(() => AccumulateOffset({written$, thread$, meta$}))
  t.deepEqual(messages, [
    onNext(310, {offsets: [3, 10, 20], restParams: '#'}),
    onNext(320, {offsets: [3, 13, 20], restParams: '#'}),
    onNext(330, {offsets: [3, 13, 23], restParams: '#'}),
    onNext(340, {offsets: [6, 13, 23], restParams: '#'}),
    onNext(350, {offsets: [9, 13, 23], restParams: '#'}),
    onNext(360, {offsets: [9, 16, 23], restParams: '#'})
  ])
})
