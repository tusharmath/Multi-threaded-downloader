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
  const Path = x => '/home/downloads/' + x
  const options$ = sh.createHotObservable(
    onNext(210, {url: 'a/b/c.txt'}),
    onNext(220, {file: 'home.txt.mtd'}),
    onNext(230, {file: 'home.txt.mtd', url: 'a/b/c.txt'}),
    onCompleted(300)
  )
  const {messages} = sh.startScheduler(() => GetDownloadType(Path, options$))
  t.deepEqual(messages, [
    onNext(210, {
      type: DOWNLOAD_TYPES.NEW,
      options: {
        url: 'a/b/c.txt',
        path: '/home/downloads/c.txt',
        mtdPath: '/home/downloads/c.txt.mtd'
      }
    }),
    onNext(220, {
      type: DOWNLOAD_TYPES.OLD,
      options: {
        path: '/home/downloads/home.txt',
        mtdPath: '/home/downloads/home.txt.mtd',
        file: 'home.txt.mtd'
      }
    }),
    onNext(230, {
      type: DOWNLOAD_TYPES.NEW,
      options: {
        url: 'a/b/c.txt',
        path: '/home/downloads/c.txt',
        mtdPath: '/home/downloads/c.txt.mtd',
        file: 'home.txt.mtd'
      }
    }),
    onCompleted(300)
  ])
})
