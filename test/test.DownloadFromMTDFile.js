/**
 * Created by tushar.mathur on 25/06/16.
 */

'use strict'
import {ReactiveTest, TestScheduler} from 'rx'
import test from 'ava'
import {DownloadFromMTDFile} from '../src/DownloadFromMTDFile'
import {BUFFER_SIZE} from '../src/Utils'
import {demux, mux} from 'muxer'
import {spy} from 'sinon'

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
const MockFILE = (sh, meta = MockMETA) => {
  return {
    open: Hot(sh, onNext(210, 19), onCompleted(210)),
    fstat: Hot(sh, onNext(220, {size: 9000}), onCompleted(220)),
    read: Hot(sh,
      onNext(230, [25, {toString: () => JSON.stringify(meta)}]),
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
  const responses = [
    sh.createColdObservable(onNext(10, 'RESPONSE_0'), onCompleted(10)),
    sh.createColdObservable(onNext(10, 'RESPONSE_1'), onCompleted(10)),
    sh.createColdObservable(onNext(10, 'RESPONSE_2'), onCompleted(10))
  ]
  const buffer$ = sh.createColdObservable(onCompleted(15))
  const request = spy(() => mux({buffer$, response$: responses.shift()}))
  return {request}
}
const createParams = (sh, meta) => ({
  FILE: MockFILE(sh, meta),
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

test('response$', t => {
  const sh = new TestScheduler()
  const params = createParams(sh, {
    threads: [[0, 10], [11, 20], [21, 30]],
    offsets: [0, 11, 21],
    url: '/a/b/c'
  })
  const {messages} = sh.startScheduler(
    () => pluck('response$', DownloadFromMTDFile(params, './home/file.mtd').share())
  )
  t.is(params.HTTP.request.callCount, 3)
  t.deepEqual(messages, [
    onNext(240, 'RESPONSE_0'),
    onNext(240, 'RESPONSE_1'),
    onNext(240, 'RESPONSE_2'),
    onCompleted(260)
  ])
})

test('responses$', t => {
  const sh = new TestScheduler()
  const params = createParams(sh, {
    threads: [[0, 10], [11, 20], [21, 30]],
    offsets: [0, 11, 21],
    url: '/a/b/c'
  })
  const {messages} = sh.startScheduler(
    () => pluck('responses$', DownloadFromMTDFile(params, './home/file.mtd'))
  )
  t.deepEqual(messages, [
    onNext(240, ['RESPONSE_0', 'RESPONSE_1', 'RESPONSE_2']),
    onCompleted(260)
  ])
})

test('requestCount', t => {
  const sh = new TestScheduler()
  const params = createParams(sh, {
    threads: [[0, 10], [11, 20], [21, 30]],
    offsets: [0, 11, 21]
  })
  sh.startScheduler(() => DownloadFromMTDFile(params, './home/file.mtd'))
  t.is(params.HTTP.request.callCount, 3)
})

test('override meta data', t => {
  const sh = new TestScheduler()
  const params = createParams(sh, {
    url: '/a/b/c',
    threads: [[0, 10]],
    offsets: [5]
  })
  sh.startScheduler(() => DownloadFromMTDFile(params, './home/file.mtd', {url: '/p/q/r'}))
  t.is(params.HTTP.request.callCount, 1)
  t.true(params.HTTP.request.calledWith({
    url: '/p/q/r',
    headers: {range: 'bytes=5-10'}
  }))
})
