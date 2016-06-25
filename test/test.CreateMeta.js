import {CreateMeta$} from '../src/Utils'
import * as err from '../src/Error'
import test from 'ava'
import {TestScheduler, ReactiveTest} from 'rx'
import {createTestObserver} from '../perf/TestHelpers'
const {onNext, onCompleted} = ReactiveTest

test((t) => {
  const options = {
    range: 2,
    url: 'sample-url',
    a: 1,
    b: 2
  }
  const sh = new TestScheduler()
  const size$ = sh.createHotObservable(onNext(220, 8000), onCompleted())
  const out = createTestObserver(CreateMeta$({size$, options}))
  sh.start()
  t.deepEqual(out, [
    {
      range: 2,
      url: 'sample-url',
      totalBytes: 8000,
      threads: [[0, 3999], [4000, 8000]],
      offsets: [0, 4000],
      a: 1,
      b: 2
    }
  ])
})

test('invalid size', (t) => {
  const options = {
    range: 2, url: 'sample-url', a: 1, b: 2
  }
  const sh = new TestScheduler()
  const size$ = sh.createHotObservable(onNext(220, 'AAA'), onCompleted())
  createTestObserver(CreateMeta$({size$, options}))
  try {
    sh.start()
  } catch (e) {
    t.is(e.message, err.FILE_SIZE_UNKNOWN)
    t.true(e instanceof err.MTDError)
  }
})
