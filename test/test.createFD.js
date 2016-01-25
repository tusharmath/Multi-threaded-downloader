/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

import createFileDescriptors from '../src/createFD'
import test from 'ava'
import {TestScheduler, ReactiveTest} from 'rx'

const {onNext, onCompleted} = ReactiveTest

test.only(t => {
  t.pass()
  const out = []
  const scheduler = new TestScheduler()
  const fd = {
    'w': scheduler.createColdObservable(onNext(220, 'fd:w'), onCompleted()),
    'r+': scheduler.createColdObservable(onNext(210, 'fd:r+'), onCompleted())
  }

  const fsOpen = (path, flag) => {
    out.push({path, flag})
    return fd[flag]
  }
  const ob = {fsOpen}
  createFileDescriptors(ob, 'sample-path')
    .fd
    .subscribe(x => out.push(x))
  scheduler.start()
  t.same(out, [
    {path: 'sample-path', flag: 'w'},
    {fd: 'fd:w', flag: 'w'},
    {path: 'sample-path', flag: 'r+'},
    {fd: 'fd:r+', flag: 'r+'}
  ])
})
