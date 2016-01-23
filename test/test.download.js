/**
 * Created by tushar.mathur on 23/01/16.
 */

'use strict'

import {download} from '../src/download'
import test from 'ava'
import {spy} from 'sinon'
import {TestScheduler, ReactiveTest} from 'rx'

const {onNext, onCompleted} = ReactiveTest

const scheduler = new TestScheduler()
const requestBodyStream = scheduler.createColdObservable(
  onNext(210, {event: 'response', message: {headers: {'content-length': 2000}}}),
  onNext(220, {event: 'data', message: 100}),
  onNext(230, {event: 'data', message: 200}),
  onNext(240, {event: 'data', message: 300}),
  onCompleted(250)
)

const fsOpenStream = scheduler.createColdObservable(
  onNext(210, 9000),
  onCompleted(290)
)

test('fsOpen:r+', async function (t) {
  const ob = {
    fsOpen: spy(() => fsOpenStream),
    requestBody: () => requestBodyStream,
    fsWriteBuffer: () => [{}],
    fsTruncate: () => [{}],
    fsRename: () => [{}]
  }

  const d = download(ob, {mtdPath: 'honey-singh'}).toPromise()
  scheduler.start()
  await d
  t.same(ob.fsOpen.args[0], ['honey-singh', 'r+'])
})

