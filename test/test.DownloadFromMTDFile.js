/**
 * Created by tushar.mathur on 25/06/16.
 */

'use strict'
import {ReactiveTest, TestScheduler} from 'rx'
import test from 'ava'
import {DownloadFromMTDFile} from '../src/DownloadFromMTDFile'
import {BUFFER_SIZE} from '../src/Utils'
import {demux} from 'muxer'

/**
 * Helpers
 */
const {onNext, onCompleted} = ReactiveTest
const Hot = (sh, ...args) => () => sh.createHotObservable(...args)
const pluck = (key, $) => demux($, key)[0][key]
const MockMETA = {
  threads: [],
  offsets: [],
  url: '/a/b/c'
}
const MockFILE = (sh) => {
  return {
    open: Hot(sh, onNext(210, 19), onCompleted(210)),
    fstat: Hot(sh, onNext(220, {size: 9000}), onCompleted(220)),
    read: Hot(sh,
      onNext(230, [25, {toString: () => JSON.stringify(MockMETA)}]),
      onCompleted(230)
    ),
    write: Hot(sh,
      onNext(240, 'WRITE-0'),
      onNext(250, 'WRITE-1'),
      onNext(260, 'WRITE-2'),
      onCompleted(260)
    )
  }
}
const MockHTTP = (sh) => {
  return {}
}
const createParams = (sh) => ({
  FILE: MockFILE(sh),
  HTTP: MockHTTP(sh)
})

test('localFileSize$', t => {
  const sh = new TestScheduler()
  const params = createParams(sh)
  const {messages} = sh.startScheduler(
    () => pluck('localFileSize$', DownloadFromMTDFile(params, './home/file.mtd'))
  )
  t.deepEqual(messages, [
    onNext(220, 9000),
    onCompleted(260)
  ])
})

test('fdR$', t => {
  const sh = new TestScheduler()
  const params = createParams(sh)
  const {messages} = sh.startScheduler(
    () => pluck('fdR$', DownloadFromMTDFile(params, './home/file.mtd'))
  )
  t.deepEqual(messages, [
    onNext(210, 19),
    onCompleted(260)
  ])
})

test('metaWritten$', t => {
  const sh = new TestScheduler()
  const params = createParams(sh)
  const {messages} = sh.startScheduler(
    () => pluck('metaWritten$', DownloadFromMTDFile(params, './home/file.mtd'))
  )
  t.deepEqual(messages, [
    onNext(240, 'WRITE-0'),
    onNext(250, 'WRITE-1'),
    onNext(260, 'WRITE-2'),
    onCompleted(260)
  ])
})

test('metaPosition$', t => {
  const sh = new TestScheduler()
  const params = createParams(sh)
  const {messages} = sh.startScheduler(
    () => pluck('metaPosition$', DownloadFromMTDFile(params, './home/file.mtd'))
  )
  t.deepEqual(messages, [
    onNext(220, (9000 - BUFFER_SIZE)),
    onCompleted(260)
  ])
})
