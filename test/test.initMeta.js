import initMeta from '../src/initMeta'
import test from 'ava'
import { TestScheduler, ReactiveTest } from 'rx'
import { createTestObserver } from '../perf/utils'
const {onNext, onCompleted} = ReactiveTest

test(t => {
  const options = {
    range: 2,
    url: 'sample-url',
    a: 1,
    b: 2
  }
  const sh = new TestScheduler()
  const ob = {
    requestContentLength: () => sh.createHotObservable(onNext(220, 8000), onCompleted())
  }
  const out = createTestObserver(initMeta(ob, options))
  sh.start()
  t.same(out, [
    {
      range: 2,
      url: 'sample-url',
      totalBytes: 8000,
      threads: [[0, 3999], [4000, 8000]],
      offsets: [0, 4000]
    }
  ])
})
