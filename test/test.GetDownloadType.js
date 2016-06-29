/**
 * Created by tushar.mathur on 29/06/16.
 */

'use strict'
import {ReactiveTest, TestScheduler} from 'rx'
import test from 'ava'
import {GetDownloadType, DOWNLOAD_TYPES} from '../src/Utils'
const {onNext, onCompleted} = ReactiveTest

test(t => {
  const sh = new TestScheduler()
  const Path = x => x + '-resolved'
  const options$ = sh.createHotObservable(
    onNext(210, {url: 'a/b/c'}),
    onNext(220, {path: '/home.txt'}),
    onCompleted(300)
  )
  const {messages} = sh.startScheduler(() => GetDownloadType(Path, options$))
  t.deepEqual(messages, [
    onNext(210, {
      type: DOWNLOAD_TYPES.NEW,
      options: {
        url: 'a/b/c',
        path: 'a/b/c-resolved',
        mtdPath: 'a/b/c-resolved.mtd'
      }
    }),
    onNext(220, {
      type: DOWNLOAD_TYPES.OLD,
      options: {path: '/home.txt', mtdPath: '/home.txt.mtd'}
    }),
    onCompleted(300)
  ])
})
