/**
 * Created by tushar.mathur on 22/01/16.
 */

'use strict'

import Path from 'path'
import {create} from '../src/create'
import {createFileDigest, fsStat, removeFile} from '../perf/utils'
import ob from '../src/observables'
import test from 'ava'

const path = Path.normalize(Path.join(__dirname, '../.temp/pug-create.jpg'))

test.before(async function () {
  await create(ob, {url: 'http://localhost:3100/files/pug.jpg', path}).toPromise()
})
test.after(async function () {
  await removeFile(path)
})

test('digest', async function (t) {
  const digest = await createFileDigest(path)
  t.same(digest, 'F1C3BD997C5152E59C792D48F448844B82916E0A')
})

test('size', async function (t) {
  const stats = (await fsStat(path))[1]
  t.same(stats.size, 317235 + 512)
})

