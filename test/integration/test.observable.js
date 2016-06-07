/**
 * Created by tushar.mathur on 21/01/16.
 */

'use strict'
import {server} from '../../perf/server'
import test from 'ava'
import {HTTP} from '../../src/Transformers'

let closeHttp
/*eslint-disable */
test.before(async function () {
  closeHttp = await server(3100)
})

test.after(async function () {
  await closeHttp()
})

test('requestBody', async function (t) {
  const response = await HTTP()
    .requestBody({url: 'http://localhost:3100/files/pug.jpg'})
    .filter((x) => x.event === 'response').pluck('message')
    .toPromise()
  t.deepEqual(response.headers['content-length'], '317235')
})

test('requestBody:https', async function (t) {
  const response = await HTTP()
    .requestBody({url: 'https://localhost:3101/files/pug.jpg', method: 'HEAD', strictSSL: false})
    .filter((x) => x.event === 'response').pluck('message')
    .toPromise()
  t.deepEqual(response.headers['content-length'], '317235')
})

test('requestContentLength', async function (t) {
  const size = await HTTP()
    .requestContentLength({url: 'https://localhost:3101/fixed-size', strictSSL: false})
    .toPromise()
  t.deepEqual(size, 41)
})

test('requestHead', async function (t) {
  const response = await HTTP().requestHead({url: 'http://localhost:3100/files/pug.jpg'}).toPromise()
  /**
   *  To know if the socket is destroyed or not
   *  https://nodejs.org/api/net.html#net_socket_remoteaddress
   */
  t.is(response.socket.remoteAddress, undefined)
})

/*eslint-enable */
