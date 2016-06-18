/**
 * Created by tushar.mathur on 10/06/16.
 */

'use strict'
import test from 'ava'
import {TestScheduler, ReactiveTest} from 'rx'
import {spy} from 'sinon'
import {mux} from 'muxer'
import {RequestDataOffset} from '../src/Utils'
const {onNext} = ReactiveTest

test((t) => {
  const sh = new TestScheduler()
  const requestParams = {a: '1', b: '2'}
  const offset = 1000
  const data$ = sh.createHotObservable(
    onNext(220, 'BUFFER'),
    onNext(230, 'BUFFER1'),
    onNext(240, 'BUFFER22'),
    onNext(250, 'BUFFER333')
  )
  const response$ = sh.createHotObservable(onNext(210, 'RESPONSE'))
  const request = spy(() => mux({data$, response$}))
  const HTTP = {request}
  const {messages} = sh.startScheduler(() => RequestDataOffset({HTTP, offset, requestParams}))
  t.true(request.calledWith(requestParams))
  t.deepEqual(messages, [
    onNext(210, ['response$', 'RESPONSE']),
    onNext(220, ['buffer$', ['BUFFER', 1000]]),
    onNext(230, ['buffer$', ['BUFFER1', 1006]]),
    onNext(240, ['buffer$', ['BUFFER22', 1013]]),
    onNext(250, ['buffer$', ['BUFFER333', 1021]])
  ])
})
