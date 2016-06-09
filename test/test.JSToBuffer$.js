/**
 * Created by tushar.mathur on 09/06/16.
 */

'use strict'

import test from 'ava'
import {TestScheduler, ReactiveTest} from 'rx'
import {JSToBuffer$, BUFFER_SIZE} from '../src/Utils'
const {onNext} = ReactiveTest

test(t => {
  let value
  const sh = new TestScheduler()
  const js = {a: 1, b: 2}
  const js$ = sh.createHotObservable(onNext(210, js))
  JSToBuffer$(js$).subscribe(x => (value = x))
  sh.start()
  t.is(value.length, BUFFER_SIZE)
  t.is(value.toString().trim(), JSON.stringify(js))
})
