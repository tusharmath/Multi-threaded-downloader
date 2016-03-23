/**
 * Created by tushar.mathur on 21/01/16.
 */

'use strict'
import {server} from '../../perf/server'
import test from 'ava'
import Observables from '../../src/observables'

var closeHttp
/*eslint-disable */
test.before(async function () {
  closeHttp = await server(3100)
})

test.after(async function () {
  await closeHttp()
})

test(async function (t) {
  const response = await Observables
    .requestBody({url: 'http://localhost:3100/files/pug.jpg'})
    .filter((x) => x.event === 'response').pluck('message')
    .toPromise()
  t.same(response.headers['content-length'], '317235')
})

test(async function (t) {
  const response = await Observables
    .requestBody({url: 'https://localhost:3101/files/pug.jpg', method: 'HEAD', strictSSL: false})
    .filter((x) => x.event === 'response').pluck('message')
    .toPromise()
  t.same(response.headers['content-length'], '317235')
})

test(async function (t) {
  const size = await Observables
    .requestContentLength({url: 'https://localhost:3101/fixed-size', strictSSL: false})
    .toPromise()
  t.same(size, 41)
})

/*eslint-enable */
