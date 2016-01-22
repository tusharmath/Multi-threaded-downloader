/**
 * Created by tushar.mathur on 21/01/16.
 */

'use strict'
import Path from 'path'
import test from 'ava'
import {removeFile, createFileDigest} from './../perf/utils'
import {download} from '../src/download'
import ob from '../src/observables'

const path1 = Path.normalize(Path.join(__dirname, '../.temp/download-file1'))
const path2 = Path.normalize(Path.join(__dirname, '../.temp/download-file2'))
const path3 = Path.normalize(Path.join(__dirname, '../.temp/download-file3'))

const paths = [
  path1,
  path2,
  path3
]

test.after(async function () {
  await paths.map(removeFile)
})

test('http', async function (t) {
  await download(ob, {
    url: 'http://localhost:3100/files/pug.jpg',
    path: path1,
    mtdPath: path1 + '.mtd'
  }).toPromise()
  const digest = await createFileDigest(path1)
  t.same(digest, '25FD4542D7FFFB3AEC9EF0D25A533DDE4803B9C1')
})

test('https', async function (t) {
  await download(ob, {
    url: 'https://localhost:3101/files/pug.jpg',
    path: path2,
    mtdPath: path2 + '.mtd',
    strictSSL: false
  }).toPromise()
  const digest = await createFileDigest(path2)
  t.same(digest, '25FD4542D7FFFB3AEC9EF0D25A533DDE4803B9C1')
})

test('http(2)', async function (t) {
  await download(ob, {
    url: 'http://localhost:3100/files/in.txt',
    path: path3,
    mtdPath: path3 + '.mtd'
  }).toPromise()
  const digest = await createFileDigest(path3)
  t.same(digest, 'A9070D71168B5135910A04F0650A91541B72762E')
})
