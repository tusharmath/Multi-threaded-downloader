/**
 * Created by tushar.mathur on 27/06/16.
 */

'use strict'
import {ReactiveTest, TestScheduler} from 'rx'
import test from 'ava'
import {FinalizeDownload} from '../src/FinalizeDownload'
const {onNext, onCompleted} = ReactiveTest

test('complete', t => {
  const sh = new TestScheduler()
  const fd$ = sh.createHotObservable(onNext(210, 100), onCompleted(210))
  const meta$ = sh.createHotObservable(
    onNext(220, {
      threads: [[0, 10], [11, 20]],
      offsets: [10, 20]
    }),
    onCompleted(220)
  )
  const truncate$ = sh.createHotObservable(
    onNext(300, 'TRUNCATED'),
    onCompleted(300)
  )

  const rename$ = sh.createHotObservable(
    onNext(400, 'RENAMED'),
    onCompleted(400)
  )
  const FILE = {
    truncate: () => truncate$,
    rename: () => rename$
  }
  const {messages} = sh.startScheduler(
    () => FinalizeDownload({FILE}, {fd$, meta$})
  )
  t.deepEqual(messages, [
    onNext(300, ['truncated$', 'TRUNCATED']),
    onNext(400, ['renamed$', 'RENAMED']),
    onCompleted(400)
  ])
})

test('incomplete', t => {
  const sh = new TestScheduler()
  const fd$ = sh.createHotObservable(onNext(210, 100), onCompleted(210))
  const meta$ = sh.createHotObservable(
    onNext(220, {
      threads: [[0, 10], [11, 20]],
      offsets: [5, 20]
    }),
    onCompleted(220)
  )
  const truncate$ = sh.createHotObservable(
    onNext(300, 'TRUNCATED'),
    onCompleted(300)
  )
  const rename$ = sh.createHotObservable(
    onNext(400, 'RENAMED'),
    onCompleted(400)
  )
  const FILE = {
    truncate: () => truncate$,
    rename: () => rename$
  }
  const {messages} = sh.startScheduler(
    () => FinalizeDownload({FILE}, {fd$, meta$})
  )
  t.deepEqual(messages, [
    onNext(220, ['noop$', false]),
    onCompleted(220)
  ])
})
