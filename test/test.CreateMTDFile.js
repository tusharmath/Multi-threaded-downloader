/**
 * Created by tushar.mathur on 25/06/16.
 */

'use strict'

import {ReactiveTest, TestScheduler} from 'rx'
import test from 'ava'
import {CreateMTDFile} from '../src/Utils'
import {demux} from 'muxer'
const {onNext, onCompleted} = ReactiveTest
const Hot = (sh, ...args) => () => sh.createHotObservable(...args)
const MockFILE = (sh) => {
  return {
    open: Hot(sh, onNext(210, 19), onCompleted(210)),
    write: Hot(sh, onNext(230, [1000, 'BUFFER-WRITTEN']), onCompleted(230))
  }
}

const MockHTTP = (sh) => {
  return {
    requestHead: Hot(sh,
      onNext(220, {headers: {'content-length': '9000'}}),
      onCompleted(220))
  }
}

const pluck = (key, $) => demux($, key)[0][key]
const createParams = (sh, options) => ({
  FILE: MockFILE(sh),
  HTTP: MockHTTP(sh),
  options
})

test('meta$', t => {
  const sh = new TestScheduler()
  const options = {url: '/a/b/c', range: 3}
  const params = createParams(sh, options)
  const {messages} = sh.startScheduler(() => pluck('meta$', CreateMTDFile(params)))
  t.deepEqual(messages, [
    onNext(220, {
      url: '/a/b/c', range: 3, totalBytes: 9000,
      offsets: [0, 3000, 6000],
      threads: [[0, 2999], [3000, 5999], [6000, 9000]]
    }),
    onCompleted(230)
  ])
})

test('written$', t => {
  const sh = new TestScheduler()
  const options = {url: '/a/b/c', range: 3}
  const params = createParams(sh, options)
  const {messages} = sh.startScheduler(() => pluck('written$', CreateMTDFile(params)))
  t.deepEqual(messages, [
    onNext(230, [1000, 'BUFFER-WRITTEN']),
    onCompleted(230)
  ])
})

test('remoteFileSize$', t => {
  const sh = new TestScheduler()
  const options = {url: '/a/b/c', range: 3}
  const params = createParams(sh, options)
  const {messages} = sh.startScheduler(() => pluck('remoteFileSize$', CreateMTDFile(params)))
  t.deepEqual(messages, [
    onNext(220, 9000),
    onCompleted(230)
  ])
})

test('fdW$', t => {
  const sh = new TestScheduler()
  const options = {url: '/a/b/c', range: 3}
  const params = createParams(sh, options)
  const {messages} = sh.startScheduler(() => pluck('fdW$', CreateMTDFile(params)))
  t.deepEqual(messages, [
    onNext(210, 19),
    onCompleted(230)
  ])
})
