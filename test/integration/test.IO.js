/**
 * Created by tushar.mathur on 21/01/16.
 */

'use strict'
import request from 'request'
import {server} from '../../perf/server'
import test from 'ava'
import {HTTP} from '../../src/IO'
import {demux} from 'muxer'

const http = HTTP(request)
let closeHttp
/*eslint-disable */
test.before(async function () {
  closeHttp = await server(3100)
})

test.after(async function () {
  await closeHttp()
})

test('request', async function (t) {
  const params = {url: 'http://localhost:3100/files/pug.jpg', method: 'HEAD'}
  const [{response$}] = demux(http.request(params), 'response$')
  const response = await response$.toPromise()
  t.deepEqual(response.headers['content-length'], '317235')
})

test('request:https', async function (t) {
  const params = {url: 'https://localhost:3101/files/pug.jpg', method: 'HEAD', strictSSL: false}
  const [{response$}] = demux(http.request(params), 'response$')
  const response = await response$.toPromise()
  t.deepEqual(response.headers['content-length'], '317235')
})

test('requestHead', async function (t) {
  const response = await http.requestHead({url: 'http://localhost:3100/files/pug.jpg'}).toPromise()
  /**
   *  To know if the socket is destroyed or not
   *  https://nodejs.org/api/net.html#net_socket_remoteaddress
   */
  t.is(response.socket.remoteAddress, undefined)
  t.true(response.socket.destroyed)

  /**
   * Check Headers
   */
  const headers = response.headers
  t.is(headers['x-powered-by'], 'Express')
  t.is(headers['accept-ranges'], 'bytes')
  t.is(headers['cache-control'], 'public, max-age=0')
  // t.is(headers['last-modified'], 'Fri, 29 Jan 2016 15:59:57 GMT')
  // t.is(headers['etag'], 'W/"4d733-1528e1cc848"')
  t.is(headers['content-type'], 'image/jpeg')
  t.is(headers['content-length'], '317235')
  t.is(headers['connection'], 'close')

})

/*eslint-enable */
