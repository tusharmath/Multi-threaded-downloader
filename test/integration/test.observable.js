/**
 * Created by tushar.mathur on 21/01/16.
 */

'use strict'
import request from 'request'
import {server} from '../../perf/server'
import test from 'ava'
import {HTTP} from '../../src/Transformers'

const http = HTTP(request)[0]
let closeHttp
/*eslint-disable */
test.before(async function () {
  closeHttp = await server(3100)
})

test.after(async function () {
  await closeHttp()
})

test('requestBody', async function (t) {
  const response = await http
    .requestBody({url: 'http://localhost:3100/files/pug.jpg'})
    .filter((x) => x.event === 'response').pluck('message')
    .toPromise()
  t.deepEqual(response.headers['content-length'], '317235')
})

test('requestBody:https', async function (t) {
  const response = await http
    .requestBody({url: 'https://localhost:3101/files/pug.jpg', method: 'HEAD', strictSSL: false})
    .filter((x) => x.event === 'response').pluck('message')
    .toPromise()
  t.deepEqual(response.headers['content-length'], '317235')
})

test('requestHead', async function (t) {
  const response = await http.requestHead({url: 'http://localhost:3100/files/pug.jpg'}).toPromise()
  /**
   *  To know if the socket is destroyed or not
   *  https://nodejs.org/api/net.html#net_socket_remoteaddress
   */
  t.is(response.socket.remoteAddress, undefined)
  const headers = response.headers
  t.is(headers['x-powered-by'], 'Express')
  t.is(headers['accept-ranges'], 'bytes')
  t.is(headers['cache-control'], 'public, max-age=0')
  // t.is(headers['last-modified'], 'Fri, 29 Jan 2016 15:59:57 GMT')
  t.is(headers['etag'], 'W/"4d733-1528e1cc848"')
  t.is(headers['content-type'], 'image/jpeg')
  t.is(headers['content-length'], '317235')
  t.is(headers['connection'], 'close')

})

/*eslint-enable */
