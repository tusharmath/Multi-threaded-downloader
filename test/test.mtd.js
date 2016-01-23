/**
 * Created by tushar.mathur on 21/01/16.
 */

'use strict'
import Path from 'path'
import test from 'ava'
import {removeFile, createFileDigest} from './../perf/utils'
import Download from '../src/mtd'
import ob from '../src/observables'

const pathFactory = () => {
  var i = 0
  return () => Path.normalize(Path.join(__dirname, '../.temp/download-file' + i++))
}

const createPath = pathFactory()
const path1 = createPath()
const path2 = createPath()
const path3 = createPath()

const paths = [
  path1,
  path2,
  path3
]

test.after(async function () {
  await paths.map(removeFile)
})

test('http', async function (t) {
  const d = new Download({
    url: 'http://localhost:3100/files/pug.jpg',
    path: path1
  })
  await d.start()
  const digest = await createFileDigest(path1)
  t.same(digest, '25FD4542D7FFFB3AEC9EF0D25A533DDE4803B9C1')
})

test('https', async function (t) {
  const d = new Download({
    url: 'https://localhost:3101/files/pug.jpg',
    path: path2,
    strictSSL: false
  })
  await d.start()
  const digest = await createFileDigest(path2)
  t.same(digest, '25FD4542D7FFFB3AEC9EF0D25A533DDE4803B9C1')
})

test('http(2)', async function (t) {
  const d = new Download({
    url: 'http://localhost:3100/files/in.txt',
    path: path3
  })
  await d.start()
  const digest = await createFileDigest(path3)
  t.same(digest, 'A9070D71168B5135910A04F0650A91541B72762E')
})
