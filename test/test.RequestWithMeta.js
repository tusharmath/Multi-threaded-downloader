/**
 * Created by tushar.mathur on 26/06/16.
 */

'use strict'

import {ReactiveTest, TestScheduler} from 'rx'
import test from 'ava'
import {mux} from 'muxer'
import {RequestWithMeta} from '../src/Utils'
const {onNext, onCompleted} = ReactiveTest

test(t => {
  const sh = new TestScheduler()
  const response$ = sh.createHotObservable(
    onNext(300, 'RESPONSE'),
    onCompleted(300)
  )
  const data$ = sh.createHotObservable(
    onNext(300, 'BUFFER'),
    onNext(310, 'BUFFER'),
    onCompleted(310)
  )
  const HTTP = {request: () => mux({response$, data$})}
  const meta = {
    url: '/a/b/c',
    threads: [[0, 10]],
    offsets: [5]
  }
  const meta$ = sh.createHotObservable(
    onNext(210, meta),
    onCompleted(210)
  )
  const {messages} = sh.startScheduler(() => RequestWithMeta(HTTP, meta$))
  t.deepEqual(messages, [
    onNext(300, ['response$', 'RESPONSE']),
    onNext(300, ['buffer$', ['BUFFER', 5, 0]]),
    onNext(310, ['buffer$', ['BUFFER', 11, 0]]),
    onCompleted(310)
  ])
})
