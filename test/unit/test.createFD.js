/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'

import createFD from '../../src/createFD'
import test from 'ava'
import { TestScheduler, ReactiveTest } from 'rx'
const {onNext, onCompleted} = ReactiveTest

test((t) => {
  const out = []
  const sh = new TestScheduler()
  const fsOpen = (path, flag) => {
    out.push({path, flag})
    return sh.createHotObservable(onNext(300, 9000), onCompleted())
  }
  const ob = {fsOpen}
  const fd = createFD(ob, 'sample-path')
  t.same(out, [])
  fd('w').subscribe((x) => out.push(x))
  sh.start()
  t.same(out, [
    {path: 'sample-path', flag: 'w'},
    9000
  ])
})
