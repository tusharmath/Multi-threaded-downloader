/**
 * Created by tushar.mathur on 10/06/16.
 */

'use strict'
import test from 'ava'
import {TestScheduler, ReactiveTest} from 'rx'
import {spy} from 'sinon'
import {RequestDataOffset} from '../src/Utils'
const {onNext} = ReactiveTest

test((t) => {
  const sh = new TestScheduler()
  const requestParams = {a: '1', b: '2'}
  const offset = 1000
  const requestBody = spy(x => sh.createHotObservable(
    onNext(220, 'BUFFER'),
    onNext(230, 'BUFFER1'),
    onNext(240, 'BUFFER22'),
    onNext(250, 'BUFFER333')
  ))
  const HTTP = {requestBody, select: () => x => x}
  const {messages} = sh.startScheduler(() => RequestDataOffset({HTTP, offset, requestParams}))
  t.true(requestBody.calledWith(requestParams))
  t.deepEqual(messages, [
    onNext(220, ['BUFFER', 1000]),
    onNext(230, ['BUFFER1', 1006]),
    onNext(240, ['BUFFER22', 1013]),
    onNext(250, ['BUFFER333', 1021])
  ])
})
