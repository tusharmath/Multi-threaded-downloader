/**
 * Created by tushar.mathur on 18/06/16.
 */

'use strict'

import test from 'ava'
import {TestScheduler, ReactiveTest} from 'rx'
import {CreateRequestParamsWithOffset} from '../src/Utils'
const {onNext, onCompleted} = ReactiveTest
test((t) => {
  const sh = new TestScheduler()
  const meta$ = sh.createHotObservable(
    onNext(210, {
      offsets: [1000, 2000, 3000],
      threads: [10, 20, 30]
    }),
    onCompleted(220)
  )
  const CreateRequestParams = ({index, meta}) => meta.threads[index]
  const {messages} = sh.startScheduler(() => CreateRequestParamsWithOffset({meta$, CreateRequestParams}))
  t.deepEqual(messages, [
    onNext(210, {requestParams: 10, offset: 1000, index: 0}),
    onNext(210, {requestParams: 20, offset: 2000, index: 1}),
    onNext(210, {requestParams: 30, offset: 3000, index: 2}),
    onCompleted(220)
  ])
})
